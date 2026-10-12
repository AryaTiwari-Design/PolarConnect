import { useState } from 'react'
import { Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { EmptyState, ErrorState, Loading } from '../components/States'
import { approveResearch, pendingResearch, rejectResearch } from '../services/research'
import { useLanguage } from '../context/LanguageContext'

export default function Admin() {
  const { t } = useLanguage()
  const { data, loading, error, reload } = useFetch(pendingResearch, [])
  const [busyId, setBusyId] = useState(null)
  const [notice, setNotice] = useState(null)

  const act = async (paper, action) => {
    if (action === 'reject' && !window.confirm(`Reject "${paper.title}"? The researcher will see it as rejected.`)) return
    setBusyId(paper.id)
    setNotice(null)
    try {
      await (action === 'approve' ? approveResearch(paper.id) : rejectResearch(paper.id))
      setNotice({ ok: true, text: action === 'approve' ? `Approved "${paper.title}". It is now visible and available to the AI assistant.` : `Rejected "${paper.title}".` })
      reload()
    } catch (err) {
      setNotice({ ok: false, text: err.message })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="container-page">
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t('reviewQueue')}</h1>
      <p className="mt-1 text-navy-600">{t('reviewQueueIntro')}</p>

      {notice && (
        <p role="status" className={`mt-5 rounded-lg px-4 py-3 text-sm font-semibold ${notice.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'}`}>{notice.text}</p>
      )}

      <div className="mt-6">
        {loading && !data ? <Loading label={t('loadingPending')} /> : error ? <ErrorState message={error} onRetry={reload} /> : data.items.length === 0 ? (
          <EmptyState icon="✅" title={t('nothingToReview')} text={t('nothingToReviewText')} />
        ) : (
          <ul className="space-y-4">
            {data.items.map((p) => (
              <li key={p.id} className="panel p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip">{p.category}</span>
                  <span className="text-xs text-navy-600">{p.year} · {p.station || t('noStation')} · {p.expedition || t('noExpedition')}</span>
                </div>
                <h2 className="mt-2 text-lg font-bold">{p.title}</h2>
                <p className="text-sm text-navy-600">{p.authors}</p>
                <p className="mt-2 text-sm">{p.abstract}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn-primary" disabled={busyId === p.id} onClick={() => act(p, 'approve')}>
                    {busyId === p.id ? t('working') : t('approve')}
                  </button>
                  <button className="btn-danger" disabled={busyId === p.id} onClick={() => act(p, 'reject')}>{t('reject')}</button>
                  <Link to={`/research/${p.id}`} className="btn-secondary">{t('viewDetails')}</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

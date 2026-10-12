import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { ErrorState, Loading } from '../components/States'
import StatusBadge from '../components/StatusBadge'
import { downloadResearch, getResearch } from '../services/research'
import { useLanguage } from '../context/LanguageContext'

export default function ResearchDetail() {
  const { id } = useParams()
  const { t } = useLanguage()
  const { data: p, loading, error, reload } = useFetch(() => getResearch(id), [id])
  const [dlError, setDlError] = useState('')

  if (loading) return <div className="container-page"><Loading /></div>
  if (error) return <div className="container-page"><ErrorState message={error} onRetry={reload} /></div>

  const download = async () => {
    setDlError('')
    try {
      await downloadResearch(p.id, `${p.title}.pdf`)
    } catch (err) {
      setDlError(err.message)
    }
  }

  const meta = [
    [t('authors'), p.authors], [t('year'), p.year], [t('category'), p.category], [t('station'), p.station],
    [t('expedition'), p.expedition], [t('topic'), p.topic], [t('pages'), p.pages || null],
  ].filter(([, v]) => v)

  return (
    <div className="container-page max-w-3xl">
      <Link to="/research" className="text-sm font-semibold text-glacier-600 hover:underline">{t('backResearch')}</Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="chip">{p.category}</span>
        {p.status !== 'approved' && <StatusBadge status={p.status} />}
      </div>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{p.title}</h1>

      <h2 className="mt-8 text-lg font-bold">{t('summary')}</h2>
      <p className="mt-2 leading-7">{p.abstract || t('noSummary')}</p>

      <dl className="panel mt-8 grid gap-x-6 gap-y-4 p-5 sm:grid-cols-2">
        {meta.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs font-semibold text-navy-600">{k}</dt>
            <dd className="text-sm font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      {dlError && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{dlError}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={download} className="btn-primary">{t('downloadPdf')}</button>
        <Link to={`/chat?q=${encodeURIComponent(`Explain: ${p.title}`)}`} className="btn-secondary">{t('askAiTopic')}</Link>
        {p.station && <Link to={`/search?station=${encodeURIComponent(p.station)}`} className="btn-secondary">{t('moreFrom')} {p.station}</Link>}
      </div>
    </div>
  )
}

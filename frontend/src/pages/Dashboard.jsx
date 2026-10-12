import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useFetch from '../hooks/useFetch'
import { ErrorState, Loading, EmptyState } from '../components/States'
import ResearchCard from '../components/ResearchCard'
import StatusBadge from '../components/StatusBadge'
import { listResearch, pendingResearch } from '../services/research'
import { getBadges, getXp } from '../modules/education/services/education'
import XPBar from '../modules/education/components/XPBar'
import { ROLES } from '../utils/constants'
import { firstName } from '../utils/helpers'
import { useLanguage } from '../context/LanguageContext'
import LatestNews from '../components/LatestNews'

export default function Dashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const isResearcher = user.role === ROLES.RESEARCHER
  const isAdmin = user.role === ROLES.ADMIN

  const { data, loading, error, reload } = useFetch(async () => {
    const [recent, xp, badges] = await Promise.all([listResearch({ limit: 4 }), getXp(), getBadges()])
    const mine = isResearcher ? await listResearch({ mine: 'true' }) : null
    const pending = isAdmin ? await pendingResearch() : null
    return { recent: recent.items, xp, badges: badges.items, mine: mine?.items, pending: pending?.items }
  }, [user.role])

  if (loading) return <div className="container-page"><Loading label={t('loadingDashboard')} /></div>
  if (error) return <div className="container-page"><ErrorState message={error} onRetry={reload} /></div>

  const earned = data.badges.filter((b) => b.earned)

  return (
    <div className="container-page">
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t('dashboardHello')}, {firstName(user.name)}</h1>
      <p className="mt-1 text-navy-600">{t('dashboardIntro')}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <XPBar {...data.xp} />
        <div className="panel p-5">
          <p className="text-sm font-semibold text-navy-600">{t('badgesEarned')}</p>
          <p className="font-display text-3xl font-extrabold">{earned.length} {t('of')} {data.badges.length}</p>
          <p className="mt-2 text-2xl" aria-label="Earned badges">{earned.length ? earned.map((b) => <span key={b.id} title={b.name}>{b.icon} </span>) : <span className="text-sm text-navy-600">{t('firstBadge')}</span>}</p>
        </div>
        <div className="panel flex flex-col justify-between p-5">
          <p className="text-sm font-semibold text-navy-600">{t('keepLearning')}</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/academy" className="btn-primary">{t('continueAcademy')}</Link>
            <Link to="/chat" className="btn-secondary">{t('askAssistant')}</Link>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <LatestNews />
      </section>

      {isAdmin && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-900">
            {data.pending.length === 0 ? t('noReview') : `${data.pending.length} ${data.pending.length > 1 ? t('waitingReviews') : t('waitingReview')}`}
          </p>
          <Link to="/admin" className="btn-secondary">{t('openReviewQueue')}</Link>
        </div>
      )}

      {isResearcher && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{t('yourSubmissions')}</h2>
            <Link to="/research/upload" className="text-sm font-semibold text-glacier-600 hover:underline">{t('uploadPaperAction')}</Link>
          </div>
          {data.mine.length === 0 ? (
            <div className="mt-4"><EmptyState icon="📄" title={t('noSubmissions')} text={t('noSubmissionsText')} action={<Link to="/research/upload" className="btn-primary">{t('uploadPaperAction')}</Link>} /></div>
          ) : (
            <ul className="panel mt-4 divide-y divide-glacier-100">
              {data.mine.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                  <Link to={`/research/${p.id}`} className="text-sm font-semibold hover:text-glacier-600">{p.title}</Link>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('recentResearch')}</h2>
          <Link to="/research" className="text-sm font-semibold text-glacier-600 hover:underline">{t('seeAllResearch')}</Link>
        </div>
        {data.recent.length === 0 ? (
          <div className="mt-4"><EmptyState title={t('noApprovedPapers')} text={t('noApprovedPapersText')} /></div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.recent.map((p) => <ResearchCard key={p.id} paper={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}

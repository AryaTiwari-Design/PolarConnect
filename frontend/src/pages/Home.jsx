import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LatestNews from '../components/LatestNews'

export default function Home() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const steps = [
    [t('uploadPaper'), t('uploadPaperText')],
    [t('adminVerify'), t('adminVerifyText')],
    [t('aiReads'), t('aiReadsText')],
    [t('studentsExplore'), t('studentsExploreText')],
  ]
  const features = [
    ['📚', t('researchLibrary'), t('researchLibraryText')],
    ['🤖', t('askAssistant'), t('assistantFeatureText')],
    ['🗺️', t('stationMap'), t('stationMapText')],
    ['🎓', t('academyTitle'), t('academyFeatureText')],
  ]

  return (
    <>
      <section className="bg-navy-900 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              {t('homeTitle')}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-glacier-200">
              {t('homeIntro')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <>
                  <Link to="/chat" className="btn-light">{t('askAssistant')}</Link>
                  <Link to="/dashboard" className="inline-flex items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10">{t('goDashboard')}</Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-light">{t('createFreeAccount')}</Link>
                  <Link to="/login" className="inline-flex items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10">{t('login')}</Link>
                </>
              )}
            </div>
          </div>

          {/* A sample answer: the one thing that makes this platform different */}
          <figure className="rounded-2xl bg-white p-5 text-navy-900 shadow-2xl shadow-black/30" aria-label="Example of a cited answer">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl bg-glacier-600 px-4 py-2.5 text-sm text-white">
              {t('sampleQuestion')}
            </div>
            <div className="mt-3 rounded-2xl border border-glacier-200 px-4 py-3 text-sm leading-relaxed">
              {t('sampleAnswer')}
              <div className="mt-3 border-t border-glacier-200 pt-3">
                <p className="text-xs font-semibold text-navy-600">{t('approvedSources')}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-glacier-700">
                  <span className="rounded-lg border border-glacier-200 bg-glacier-50 px-2.5 py-1.5">Ice Shelf Thinning: A Decade of Satellite Altimetry · p. 18</span>
                  <span className="rounded-lg border border-glacier-200 bg-glacier-50 px-2.5 py-1.5">Sea Ice Extent and Climate Feedbacks · p. 7</span>
                </div>
              </div>
            </div>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">{t('paperFlowTitle')}</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, text], i) => (
            <li key={title} className="border-t-2 border-glacier-500 pt-4">
              <span className="font-display text-sm font-bold text-glacier-600">{t('stepLabel')} {i + 1}</span>
              <h3 className="mt-1 text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-navy-600">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-glacier-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{t('allInOnePlace')}</h2>
          <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {features.map(([icon, title, text]) => (
              <div key={title} className="flex gap-4">
                <span className="text-3xl" aria-hidden="true">{icon}</span>
                <div>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-navy-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <LatestNews />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl bg-glacier-100 px-6 py-10 sm:px-10">
          <h2 className="max-w-2xl text-2xl font-extrabold sm:text-3xl">{t('finalHomeTitle')}</h2>
          <p className="mt-3 max-w-2xl text-navy-800">
            {t('finalHomeText')}
          </p>
          {!user && <Link to="/register" className="btn-primary mt-6">{t('createAccount')}</Link>}
        </div>
      </section>
    </>
  )
}

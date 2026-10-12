import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import { USE_MOCK } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

export default function Layout() {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  useEffect(() => {
  window.scrollTo(0, 0)
}, [pathname])

  return (
    <div className="app-shell flex min-h-screen flex-col">
      {USE_MOCK && (
        <div className="bg-ember-400 px-4 py-1.5 text-center text-xs font-semibold text-navy-900">
          {t('demoMode')}
        </div>
      )}
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <footer className="site-footer px-4 py-6 text-center text-xs text-navy-600">
        {t('footer')}
      </footer>
    </div>
  )
}

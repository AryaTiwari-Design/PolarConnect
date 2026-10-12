import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { ROLES } from '../utils/constants'

const linkCls = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-white/15 text-white' : 'text-glacier-200 hover:text-white'}`

export default function Navbar() {
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const links = user
    ? [
        ['/dashboard', t('dashboard')],
        ['/research', t('research')],
        ['/search', t('search')],
        ['/chat', t('askAi')],
        ['/map', t('map')],
        ['/academy', t('academy')],
        ...(user.role !== ROLES.STUDENT ? [['/research/upload', t('upload')]] : []),
        ...(user.role === ROLES.ADMIN ? [['/admin', t('admin')]] : []),
      ]
    : []

  const handleLogout = async () => {
    await logout()
    close()
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" onClick={close} className="flex items-center gap-3 font-display text-lg font-extrabold">
          <span className="brand-mark" aria-hidden="true">PC</span> PolarConnect
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/research'} className={linkCls}>{label}</NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <span className="text-sm text-glacier-200">
                {user.name} <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs">{user.role}</span>
              </span>
              <button onClick={handleLogout} className="rounded-lg border border-white/25 px-3 py-1.5 text-sm font-semibold hover:bg-white/10">{t('logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm font-semibold text-glacier-200 hover:text-white">{t('login')}</Link>
              <Link to="/register" className="rounded-lg bg-aurora-400 px-4 py-2 text-sm font-bold text-navy-900 hover:bg-aurora-300">{t('createAccount')}</Link>
            </>
          )}
          <div className="nav-tools" aria-label="Display settings">
            <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} aria-label={t('language')}>
              {language === 'en' ? 'हिं' : 'EN'}
            </button>
            <button onClick={toggleTheme} aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}>
              {theme === 'dark' ? '☀' : '◐'}
            </button>
          </div>
        </div>

        <button
          className="rounded-md p-2 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-6 bg-white" />
          <span className="mt-1.5 block h-0.5 w-6 bg-white" />
          <span className="mt-1.5 block h-0.5 w-6 bg-white" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 pb-4 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1 pt-2">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/research'} onClick={close} className={linkCls}>{label}</NavLink>
            ))}
            {user ? (
              <button onClick={handleLogout} className="mt-2 rounded-lg border border-white/25 px-3 py-2 text-left text-sm font-semibold">
                {t('logout')} ({user.name})
              </button>
            ) : (
              <>
                <Link to="/login" onClick={close} className="px-3 py-2 text-sm font-semibold text-glacier-200">{t('login')}</Link>
                <Link to="/register" onClick={close} className="rounded-lg bg-aurora-400 px-4 py-2 text-center text-sm font-bold text-navy-900">{t('createAccount')}</Link>
              </>
            )}
            <div className="nav-tools mt-3">
              <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}>{language === 'en' ? 'हिंदी' : 'English'}</button>
              <button onClick={toggleTheme}>{theme === 'dark' ? t('lightMode') : t('darkMode')}</button>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

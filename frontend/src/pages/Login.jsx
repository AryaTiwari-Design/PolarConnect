import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { USE_MOCK } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

const DEMO = [
  ['Student', 'student@polarconnect.test'],
  ['Researcher', 'researcher@polarconnect.test'],
  ['Admin', 'admin@polarconnect.test'],
]

export default function Login() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email.trim(), password)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container-page max-w-md">
      <div className="panel p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold">{t('loginTitle')}</h1>
        <p className="mt-1 text-sm text-navy-600">{t('loginIntro')}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="label">{t('email')}</label>
            <input id="email" type="email" className="input" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="label">{t('password')}</label>
            <input id="password" type="password" className="input" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? t('loggingIn') : t('login')}</button>
        </form>

        <p className="mt-5 text-center text-sm text-navy-600">
          {t('newHere')} <Link to="/register" className="font-semibold text-glacier-600 hover:underline">{t('createAccount')}</Link>
        </p>

        {USE_MOCK && (
          <div className="mt-6 rounded-lg bg-glacier-50 p-4">
            <p className="text-sm font-semibold">{t('demoAccounts')}</p>
            <p className="text-xs text-navy-600">{t('demoAccountsText')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DEMO.map(([label, mail]) => (
                <button key={label} type="button" className="btn-secondary !px-3 !py-1.5" onClick={() => { setEmail(mail); setPassword('ChangeMe123') }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

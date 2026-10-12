import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="container-page">
      <div className="panel mx-auto max-w-md px-6 py-12 text-center">
        <div className="text-5xl" aria-hidden="true">🧭</div>
        <h1 className="mt-3 text-2xl font-extrabold">{t('notFoundTitle')}</h1>
        <p className="mt-1 text-sm text-navy-600">{t('notFoundText')}</p>
        <Link to="/" className="btn-primary mt-6">{t('backHome')}</Link>
      </div>
    </div>
  )
}

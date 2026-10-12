import { useLanguage } from '../context/LanguageContext'

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-navy-600" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-glacier-200 border-t-glacier-600" aria-hidden="true" />
      {label}
    </div>
  )
}

export function EmptyState({ icon = '🧊', title, text, action }) {
  return (
    <div className="panel px-6 py-12 text-center">
      <div className="text-4xl" aria-hidden="true">{icon}</div>
      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      {text && <p className="mx-auto mt-1 max-w-md text-sm text-navy-600">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  const { t } = useLanguage()

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-8 text-center" role="alert">
      <h3 className="font-bold text-rose-800">{t('couldNotLoad')}</h3>
      <p className="mt-1 text-sm text-rose-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-4">{t('tryAgain')}</button>
      )}
    </div>
  )
}

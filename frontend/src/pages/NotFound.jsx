import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-page">
      <div className="panel mx-auto max-w-md px-6 py-12 text-center">
        <div className="text-5xl" aria-hidden="true">🧭</div>
        <h1 className="mt-3 text-2xl font-extrabold">This page is off the map</h1>
        <p className="mt-1 text-sm text-navy-600">The link may be old, or the page may have moved.</p>
        <Link to="/" className="btn-primary mt-6">Back to home</Link>
      </div>
    </div>
  )
}

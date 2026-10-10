import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loading } from './States'

// <ProtectedRoute roles={['admin']}> ... </ProtectedRoute>
// This only hides pages for convenience. The backend is what really enforces access.
export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loading label="Checking your session…" />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="container-page">
        <div className="panel mx-auto max-w-md px-6 py-12 text-center">
          <div className="text-4xl" aria-hidden="true">🔒</div>
          <h1 className="mt-3 text-xl font-bold">This page is for {roles.join(' or ')} accounts</h1>
          <p className="mt-1 text-sm text-navy-600">You are signed in as a {user.role}.</p>
          <Link to="/dashboard" className="btn-primary mt-5">Back to dashboard</Link>
        </div>
      </div>
    )
  }
  return children
}

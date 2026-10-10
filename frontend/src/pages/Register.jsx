import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) return setError('Use a password with at least 8 characters.')
    setBusy(true)
    setError('')
    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim() })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container-page max-w-md">
      <div className="panel p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold">Create your account</h1>
        <p className="mt-1 text-sm text-navy-600">Free for students, teachers and researchers.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input id="name" className="input" required autoComplete="name" value={form.name} onChange={set('name')} />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" className="input" required autoComplete="email" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input id="password" type="password" className="input" required autoComplete="new-password" value={form.password} onChange={set('password')} />
            <p className="mt-1 text-xs text-navy-600">At least 8 characters.</p>
          </div>
          <div>
            <label htmlFor="role" className="label">I am a</label>
            <select id="role" className="input" value={form.role} onChange={set('role')}>
              <option value="student">Student, teacher or member of the public</option>
              <option value="researcher">Researcher (can upload papers)</option>
            </select>
          </div>
          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
        </form>

        <p className="mt-5 text-center text-sm text-navy-600">
          Already registered? <Link to="/login" className="font-semibold text-glacier-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}

import { api, USE_MOCK } from './api'

const withDefaultRole = (user) => ({ role: 'student', ...user })

export async function loginRequest(email, password) {
  const data = await api.post('/auth/login', { email, password })
  if (data.access_token) return { token: data.access_token, user: withDefaultRole(data.user) }
  return data
}

export async function registerRequest(payload) {
  const data = await api.post('/auth/register', payload)
  if (USE_MOCK) return data
  return loginRequest(payload.email, payload.password)
}

export const logoutRequest = () => (USE_MOCK ? api.post('/auth/logout') : Promise.resolve({ ok: true }))

export async function getMe() {
  const data = await api.get(USE_MOCK ? '/auth/me' : '/users/me')
  return data.user ? { user: withDefaultRole(data.user) } : withDefaultRole(data)
}

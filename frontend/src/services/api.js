import { mockRequest } from '../mocks/mockServer'

// VITE_USE_MOCK=true (default) -> demo data, no backend needed
// VITE_USE_MOCK=false          -> real Express backend at VITE_API_URL
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const TOKEN_KEY = 'polarconnect_token'
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function request(method, path, body, { raw = false } = {}) {
  const token = getToken()
  if (USE_MOCK) return mockRequest(method, path, body, token)

  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  let payload
  if (body instanceof FormData) {
    payload = body // browser sets the multipart header
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: payload })
  } catch {
    throw new Error('Cannot reach the server. Check that the backend is running.')
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    if (res.status === 401 && token) {
      clearToken()
      window.dispatchEvent(new Event('polarconnect:unauthorized'))
    }
    const err = new Error(data.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return raw ? res : res.json().catch(() => ({}))
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body ?? {}),
  raw: (path) => request('GET', path, undefined, { raw: true }),
}

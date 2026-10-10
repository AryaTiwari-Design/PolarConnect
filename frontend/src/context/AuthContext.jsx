import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { clearToken, getToken, setToken } from '../services/api'
import { getMe, loginRequest, logoutRequest, registerRequest } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getToken()))

  // Restore the session on page load
  useEffect(() => {
    if (!getToken()) return
    getMe()
      .then((d) => setUser(d.user || d))
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  // The API client fires this when the server says the token is no longer valid
  useEffect(() => {
    const onUnauthorized = () => setUser(null)
    window.addEventListener('polarconnect:unauthorized', onUnauthorized)
    return () => window.removeEventListener('polarconnect:unauthorized', onUnauthorized)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const data = await registerRequest(payload)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      /* logging out locally is enough */
    }
    clearToken()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

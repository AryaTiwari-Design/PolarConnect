import { api } from './api'

export const loginRequest = (email, password) => api.post('/auth/login', { email, password })
export const registerRequest = (payload) => api.post('/auth/register', payload)
export const logoutRequest = () => api.post('/auth/logout')
export const getMe = () => api.get('/auth/me')

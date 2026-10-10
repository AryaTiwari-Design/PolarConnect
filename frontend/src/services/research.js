import { api, USE_MOCK } from './api'
import { toQuery } from '../utils/helpers'

// params: { q, year, category, station, limit, mine }
export const listResearch = (params = {}) => api.get(`/research${toQuery(params)}`)
export const getResearch = (id) => api.get(`/research/${id}`)
export const uploadResearch = (formData) => api.post('/research', formData)

export const pendingResearch = () => api.get('/admin/research/pending')
export const approveResearch = (id) => api.post(`/admin/research/${id}/approve`)
export const rejectResearch = (id) => api.post(`/admin/research/${id}/reject`)

export async function downloadResearch(id, filename = 'paper.pdf') {
  if (USE_MOCK) {
    window.alert('Demo mode: sample papers have no PDF file. Connect the backend to download.')
    return
  }
  const res = await api.raw(`/research/${id}/download`)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

import { api } from './api'

// Returns { answer, sources: [{ paper_id, title, page }] }
export const askQuestion = (question) => api.post('/chat', { question })
// Returns { items: [{ role: 'user' | 'assistant', content, sources? }] }
export const getChatHistory = () => api.get('/chat/history')

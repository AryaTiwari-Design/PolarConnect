import { api } from '../../../services/api'

export const listLessons = () => api.get('/education')
export const getLesson = (id) => api.get(`/education/${id}`)
export const getQuiz = (id) => api.get(`/quizzes/${id}`)
// answers: array of selected option indexes, one per question. The server does the scoring.
export const submitQuiz = (id, answers) => api.post(`/quizzes/${id}/submit`, { answers })

export const getProgress = () => api.get('/users/me/progress')
export const getXp = () => api.get('/users/me/xp')
export const getBadges = () => api.get('/users/me/badges')

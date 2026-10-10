import { api } from '../../../services/api'

export const listStations = () => api.get('/stations')
export const getStation = (id) => api.get(`/stations/${id}`)

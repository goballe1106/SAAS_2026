import { api } from './api'

export interface Proyecto {
  id: string
  nombre: string
  codigo?: string
  estado: string
}

export const proyectosService = {
  getAll: async (params?: any) => {
    const response = await api.get('/api/v1/proyectos', { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/v1/proyectos/${id}`)
    return response.data
  },
  create: async (data: Partial<Proyecto>) => {
    const response = await api.post('/api/v1/proyectos', data)
    return response.data
  },
  update: async (id: string, data: Partial<Proyecto>) => {
    const response = await api.put(`/api/v1/proyectos/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/v1/proyectos/${id}`)
    return response.data
  },
}

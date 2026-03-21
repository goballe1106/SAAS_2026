import { api } from './api'

export interface Cliente {
  id: string
  razonSocial: string
  ruc?: string
  email?: string
  telefono?: string
  direccion?: string
  estado: string
}

export const clientesService = {
  getAll: async (params?: any) => {
    const response = await api.get('/api/v1/clientes', { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/v1/clientes/${id}`)
    return response.data
  },
  create: async (data: Partial<Cliente>) => {
    const response = await api.post('/api/v1/clientes', data)
    return response.data
  },
  update: async (id: string, data: Partial<Cliente>) => {
    const response = await api.put(`/api/v1/clientes/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/v1/clientes/${id}`)
    return response.data
  },
}

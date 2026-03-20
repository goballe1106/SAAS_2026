import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/v1/auth/login', { email, password })
    return response.data
  },
  logout: async () => {
    const response = await api.post('/api/v1/auth/logout')
    return response.data
  },
}

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/api/v1/dashboard')
    return response.data
  },
}

export const usuariosService = {
  getAll: async (params?: any) => {
    const response = await api.get('/api/v1/usuarios', { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/v1/usuarios/${id}`)
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post('/api/v1/usuarios', data)
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/v1/usuarios/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/v1/usuarios/${id}`)
    return response.data
  },
}

export const areasService = {
  getAll: async () => {
    const response = await api.get('/api/v1/areas')
    return response.data
  },
  getTree: async () => {
    const response = await api.get('/api/v1/areas/tree')
    return response.data
  },
  getOptions: async () => {
    const response = await api.get('/api/v1/areas/options')
    return response.data
  },
  create: async (data: any) => {
    const response = await api.post('/api/v1/areas', data)
    return response.data
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/v1/areas/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/v1/areas/${id}`)
    return response.data
  },
}

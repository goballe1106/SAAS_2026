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
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh`, { refreshToken })
          const newToken = data.data.accessToken
          localStorage.setItem('token', newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth
export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/api/v1/auth/login', { email, password })
    return data
  },
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    const { data } = await api.post('/api/v1/auth/logout', { refreshToken })
    return data
  },
  getMe: async () => {
    const { data } = await api.get('/api/v1/auth/me')
    return data
  },
}

// Dashboard
export const dashboardService = {
  getStats: async () => {
    const { data } = await api.get('/api/v1/dashboard')
    return data
  },
}

// Usuarios
export const usuariosService = {
  getAll: async (params?: any) => {
    const { data } = await api.get('/api/v1/usuarios', { params })
    return data
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/api/v1/usuarios/${id}`)
    return data
  },
  create: async (body: any) => {
    const { data } = await api.post('/api/v1/usuarios', body)
    return data
  },
  update: async (id: string, body: any) => {
    const { data } = await api.put(`/api/v1/usuarios/${id}`, body)
    return data
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/api/v1/usuarios/${id}`)
    return data
  },
}

// Areas
export const areasService = {
  getAll: async () => {
    const { data } = await api.get('/api/v1/areas')
    return data
  },
  getTree: async () => {
    const { data } = await api.get('/api/v1/areas/tree')
    return data
  },
  getOptions: async () => {
    const { data } = await api.get('/api/v1/areas/options')
    return data
  },
  create: async (body: any) => {
    const { data } = await api.post('/api/v1/areas', body)
    return data
  },
  update: async (id: string, body: any) => {
    const { data } = await api.put(`/api/v1/areas/${id}`, body)
    return data
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/api/v1/areas/${id}`)
    return data
  },
}

// Roles
export const rolesService = {
  getAll: async () => {
    const { data } = await api.get('/api/v1/roles')
    return data
  },
  getOptions: async () => {
    const { data } = await api.get('/api/v1/roles/options')
    return data
  },
}

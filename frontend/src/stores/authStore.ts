import { create } from 'zustand'
import { authService } from '../services/api'

interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  avatar?: string
  estado: string
  roles: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loadUser: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login(email, password)
      const { user, accessToken, refreshToken } = response.data

      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))

      set({ user, token: accessToken, isAuthenticated: true, isLoading: false })
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Error de conexión'
      set({ error: message, isLoading: false })
      throw err
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      set({ user: null, token: null, isAuthenticated: false })
    }
  },

  loadUser: () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const token = localStorage.getItem('token')
    set({ user, token, isAuthenticated: !!token })
  },

  clearError: () => set({ error: null }),
}))

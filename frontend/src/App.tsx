import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import UsuariosPage from './pages/usuarios/UsuariosPage'
import AreasPage from './pages/areas/AreasPage'
import ClientesPage from './pages/clientes/ClientesPage'
import { Toaster } from './components/ui/toast'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>} />
        <Route path="/usuarios" element={<PrivateRoute><Layout><UsuariosPage /></Layout></PrivateRoute>} />
        <Route path="/areas" element={<PrivateRoute><Layout><AreasPage /></Layout></PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><Layout><ClientesPage /></Layout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

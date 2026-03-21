import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import UsuariosPage from './pages/usuarios/UsuariosPage'
import AreasPage from './pages/areas/AreasPage'
import ClientesPage from './pages/clientes/ClientesPage'
import CotizacionesPage from './pages/cotizaciones/CotizacionesPage'
import ProyectosPage from './pages/proyectos/ProyectosPage'
import OperacionesPage from './pages/operaciones/OperacionesPage'
import EmpleadosPage from './pages/rrhh/EmpleadosPage'
import TicketsPage from './pages/tickets/TicketsPage'
import ActivosTIPage from './pages/inventario/ActivosTIPage'
import MantenimientosTIPage from './pages/inventario/MantenimientosTIPage'
import LicenciasPage from './pages/inventario/LicenciasPage'
import KPIsTIPage from './pages/inventario/KPIsTIPage'
import FacturacionPage from './pages/contabilidad/FacturacionPage'
import CostosPage from './pages/contabilidad/CostosPage'
import InventarioPage from './pages/logistica/InventarioPage'
import ComprasPage from './pages/logistica/ComprasPage'
import ProveedoresPage from './pages/logistica/ProveedoresPage'
import AsistenciaPage from './pages/rrhh/AsistenciaPage'
import VacacionesPage from './pages/rrhh/VacacionesPage'
import NominaPage from './pages/rrhh/NominaPage'
import TareasPage from './pages/proyectos/TareasPage'
import GanttPage from './pages/proyectos/GanttPage'
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
        <Route path="/cotizaciones" element={<PrivateRoute><Layout><CotizacionesPage /></Layout></PrivateRoute>} />
        <Route path="/proyectos" element={<PrivateRoute><Layout><ProyectosPage /></Layout></PrivateRoute>} />
        <Route path="/tareas" element={<PrivateRoute><Layout><TareasPage /></Layout></PrivateRoute>} />
        <Route path="/gantt" element={<PrivateRoute><Layout><GanttPage /></Layout></PrivateRoute>} />
        <Route path="/operaciones" element={<PrivateRoute><Layout><OperacionesPage /></Layout></PrivateRoute>} />
        <Route path="/empleados" element={<PrivateRoute><Layout><EmpleadosPage /></Layout></PrivateRoute>} />
        <Route path="/tickets" element={<PrivateRoute><Layout><TicketsPage /></Layout></PrivateRoute>} />
        <Route path="/equipos" element={<PrivateRoute><Layout><ActivosTIPage /></Layout></PrivateRoute>} />
        <Route path="/mantenimiento" element={<PrivateRoute><Layout><MantenimientosTIPage /></Layout></PrivateRoute>} />
        <Route path="/licencias" element={<PrivateRoute><Layout><LicenciasPage /></Layout></PrivateRoute>} />
        <Route path="/kpis-ti" element={<PrivateRoute><Layout><KPIsTIPage /></Layout></PrivateRoute>} />
        <Route path="/facturacion" element={<PrivateRoute><Layout><FacturacionPage /></Layout></PrivateRoute>} />
        <Route path="/costos" element={<PrivateRoute><Layout><CostosPage /></Layout></PrivateRoute>} />
        <Route path="/inventario" element={<PrivateRoute><Layout><InventarioPage /></Layout></PrivateRoute>} />
        <Route path="/compras" element={<PrivateRoute><Layout><ComprasPage /></Layout></PrivateRoute>} />
        <Route path="/proveedores" element={<PrivateRoute><Layout><ProveedoresPage /></Layout></PrivateRoute>} />
        <Route path="/asistencia" element={<PrivateRoute><Layout><AsistenciaPage /></Layout></PrivateRoute>} />
        <Route path="/vacaciones" element={<PrivateRoute><Layout><VacacionesPage /></Layout></PrivateRoute>} />
        <Route path="/nomina" element={<PrivateRoute><Layout><NominaPage /></Layout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

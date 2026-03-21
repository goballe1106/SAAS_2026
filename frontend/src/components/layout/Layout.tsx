import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Shield,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Settings,
  Search,
  Bell,
  User,
  TrendingUp,
  Package,
  FileText,
  Calendar,
  Mail,
  HelpCircle,
  BarChart3,
  FolderTree,
  Briefcase,
  FolderKanban,
  Wrench,
  CreditCard,
  Clock,
  DollarSign,
  Truck,
  Monitor,
  Key,
  ClipboardList,
  BookOpen,
  Calculator,
  ShoppingCart,
  Ticket,
  Plus,
} from 'lucide-react'

interface LayoutProps {
  children?: React.ReactNode
}

const mainNav = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Usuarios', href: '/usuarios', icon: Users },
  { name: 'Áreas', href: '/areas', icon: Building2 },
  { name: 'Roles', href: '/roles', icon: Shield },
]

const modules = [
  { 
    name: 'Proyectos y Obras', 
    icon: FolderKanban,
    items: [
      { name: 'Proyectos', href: '/proyectos', icon: FolderKanban },
      { name: 'Tareas', href: '/tareas', icon: Calendar },
      { name: 'Gantt', href: '/gantt', icon: BarChart3 },
    ]
  },
  { 
    name: 'Contabilidad', 
    icon: DollarSign,
    items: [
      { name: 'Facturación', href: '/facturacion', icon: FileText },
      { name: 'Costos', href: '/costos', icon: CreditCard },
      { name: 'Presupuestos', href: '/presupuestos', icon: Calculator },
    ]
  },
  { 
    name: 'Operaciones', 
    icon: Wrench,
    items: [
      { name: 'Órdenes de Trabajo', href: '/operaciones', icon: ClipboardList },
      { name: 'Bitácoras', href: '/bitacoras', icon: BookOpen },
      { name: 'Reportes de Avance', href: '/reportes', icon: FileText },
    ]
  },
  { 
    name: 'Logística', 
    icon: Truck,
    items: [
      { name: 'Inventario', href: '/inventario', icon: Package },
      { name: 'Compras', href: '/compras', icon: ShoppingCart },
      { name: 'Proveedores', href: '/proveedores', icon: Users },
    ]
  },
  { 
    name: 'Inventario TI', 
    icon: Monitor,
    items: [
      { name: 'Equipos', href: '/equipos', icon: Monitor },
      { name: 'Licencias', href: '/licencias', icon: Key },
      { name: 'Mantenimiento', href: '/mantenimiento', icon: Settings },
    ]
  },
  { 
    name: 'Recursos Humanos', 
    icon: Users,
    items: [
      { name: 'Empleados', href: '/empleados', icon: Users },
      { name: 'Nómina', href: '/nomina', icon: DollarSign },
      { name: 'Vacaciones', href: '/vacaciones', icon: Calendar },
    ]
  },
  { 
    name: 'Tickets', 
    icon: Ticket,
    items: [
      { name: 'Mis Tickets', href: '/tickets', icon: Ticket },
      { name: 'Nuevo Ticket', href: '/tickets/nuevo', icon: Plus },
    ]
  },
  { 
    name: 'Dashboard', 
    icon: LayoutDashboard,
    items: [
      { name: 'KPIs', href: '/dashboard', icon: BarChart3 },
      { name: 'Reportes', href: '/reportes', icon: FileText },
    ]
  },
]

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="min-h-screen flex bg-gray-50/30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-800 text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ERP</span>
            </div>
            <span className="font-bold text-lg">ERP SAS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {/* Main Nav */}
          <div className="px-3 mb-4">
            {mainNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Modules */}
          <div className="px-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Módulos
            </p>
            {modules.map((module) => {
              const isExpanded = expandedItems.includes(module.name)
              const hasActiveChild = module.items.some(item => isActive(item.href))
              
              return (
                <div key={module.name} className="mb-2">
                  <button
                    onClick={() => toggleExpanded(module.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      hasActiveChild
                        ? 'bg-slate-700/50 text-white'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <module.icon className="h-5 w-5 text-slate-400" />
                    <span className="flex-1 text-left">{module.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {module.items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive(item.href)
                              ? 'bg-blue-600/20 text-blue-400'
                              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.nombre || 'Usuario' || 'Usuario'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@erp.com' || 'admin@erp.com'}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 w-64 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
            </button>
            <button>
              <HelpCircle className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

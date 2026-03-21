import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
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
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard,
    description: 'Resumen general'
  },
  { 
    name: 'Clientes', 
    href: '/clientes', 
    icon: Users,
    description: 'Gestión de clientes'
  },
  { 
    name: 'Cotizaciones', 
    href: '/cotizaciones', 
    icon: FileText,
    description: 'Propuestas comerciales'
  },
  { 
    name: 'Proyectos', 
    href: '/proyectos', 
    icon: FolderKanban,
    description: 'Gestión de proyectos'
  },
  { 
    name: 'Operaciones', 
    href: '/operaciones', 
    icon: Package,
    description: 'Mantenimiento y operaciones'
  },
  { 
    name: 'Usuarios', 
    href: '/usuarios', 
    icon: Users,
    description: 'Gestión de usuarios'
  },
  { 
    name: 'Áreas', 
    href: '/areas', 
    icon: Building2,
    description: 'Organización'
  },
  { 
    name: 'Roles', 
    href: '/roles', 
    icon: Shield,
    description: 'Permisos y roles'
  },
]

const secondaryNavigation = [
  {
    name: 'Comercial',
    href: '#',
    icon: Briefcase,
    children: [
      { name: 'Clientes', href: '/clientes' },
      { name: 'Cotizaciones', href: '/cotizaciones' },
      { name: 'Proyectos', href: '/proyectos' },
    ]
  },
  {
    name: 'Operaciones',
    href: '#',
    icon: Package,
    children: [
      { name: 'Inventario', href: '/inventario' },
      { name: 'Activos TI', href: '/activos' },
      { name: 'Tickets', href: '/tickets' },
    ]
  },
  {
    name: 'Reportes',
    href: '#',
    icon: BarChart3,
    children: [
      { name: 'Analytics', href: '/analytics' },
      { name: 'Auditoría', href: '/auditoria' },
      { name: 'Logs', href: '/logs' },
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
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and branding */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Building2 className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                ERP SAS
              </span>
              <p className="text-xs text-slate-400">Enterprise System</p>
            </div>
          </Link>
          <button
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar..."
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Principal
            </p>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`} />
                  <div className="flex-1">
                    <p>{item.name}</p>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300">
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>

          <div className="px-3 py-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Módulos
            </p>
            {secondaryNavigation.map((section) => {
              const isExpanded = expandedItems.includes(section.name)
              const isActive = location.pathname.startsWith(section.href) && section.href !== '#'
              
              return (
                <div key={section.name} className="mb-2">
                  <button
                    onClick={() => toggleExpanded(section.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-700/50 text-white'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <section.icon className="h-5 w-5 text-slate-400" />
                    <span className="flex-1 text-left">{section.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {section.children?.map((child) => {
                        const isChildActive = location.pathname === child.href
                        return (
                          <Link
                            key={child.name}
                            to={child.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                              isChildActive
                                ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                            }`}
                          >
                            {child.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-700/50 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              <p className="text-xs text-blue-400 truncate">
                {user?.roles?.join(', ')}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Config
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-slate-300 hover:text-red-400 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-slate-900">
                {navigation.find(item => location.pathname === item.href)?.name || 'ERP SAS'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick actions */}
            <div className="hidden md:flex items-center gap-2 mr-4">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Hoy
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Reportes
              </Button>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Help */}
            <Button variant="ghost" size="sm">
              <HelpCircle className="h-5 w-5" />
            </Button>

            {/* User info */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {user?.nombre} {user?.apellido}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.roles?.join(', ')}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
                {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

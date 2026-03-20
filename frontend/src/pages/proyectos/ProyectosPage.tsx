import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { 
  FolderKanban, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  Download,
  Eye,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  Pause,
  Flag,
  Target,
  BarChart3
} from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Textarea } from '../../components/ui/textarea'

export default function ProyectosPage() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getEstadoBadge = (estado: string) => {
    const colors = {
      planificacion: 'bg-blue-100 text-blue-800',
      en_progreso: 'bg-yellow-100 text-yellow-800',
      completado: 'bg-green-100 text-green-800',
      pausado: 'bg-orange-100 text-orange-800',
      cancelado: 'bg-red-100 text-red-800',
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getEstadoIcon = (estado: string) => {
    const icons = {
      planificacion: Calendar,
      en_progreso: Play,
      completado: CheckCircle2,
      pausado: Pause,
      cancelado: AlertCircle,
    }
    return icons[estado as keyof typeof icons] || AlertCircle
  }

  const getPrioridadBadge = (prioridad: string) => {
    const colors = {
      baja: 'bg-gray-100 text-gray-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800',
    }
    return colors[prioridad as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  // Datos de ejemplo
  const proyectos = [
    {
      id: '1',
      nombre: 'Sitio Web Corporativo',
      cliente: 'Empresa ABC',
      estado: 'en_progreso',
      prioridad: 'alta',
      fechaInicio: '2024-03-01',
      fechaFin: '2024-06-30',
      progreso: 65,
      responsable: 'Juan Pérez',
      presupuesto: 25000.00,
      descripcion: 'Desarrollo completo de sitio web corporativo con CMS integrado'
    },
    {
      id: '2',
      nombre: 'Implementación ERP',
      cliente: 'Soluciones Tech',
      estado: 'planificacion',
      prioridad: 'critica',
      fechaInicio: '2024-04-01',
      fechaFin: '2024-12-31',
      progreso: 15,
      responsable: 'María García',
      presupuesto: 85000.00,
      descripcion: 'Implementación de sistema ERP para gestión empresarial'
    },
    {
      id: '3',
      nombre: 'App Móvil',
      cliente: 'Innovate Systems',
      estado: 'completado',
      prioridad: 'media',
      fechaInicio: '2024-01-15',
      fechaFin: '2024-03-15',
      progreso: 100,
      responsable: 'Carlos López',
      presupuesto: 18000.00,
      descripcion: 'Aplicación móvil para iOS y Android'
    }
  ]

  const stats = {
    total: 3,
    porEstado: [
      { estado: 'planificacion', count: 1 },
      { estado: 'en_progreso', count: 1 },
      { estado: 'completado', count: 1 }
    ],
    porPrioridad: [
      { prioridad: 'critica', count: 1 },
      { prioridad: 'alta', count: 1 },
      { prioridad: 'media', count: 1 }
    ],
    presupuestoTotal: 128000.00,
    progresoPromedio: 60
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground">Gestión de proyectos y seguimiento de tareas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nuevo Proyecto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Empresa ABC</SelectItem>
                      <SelectItem value="2">Soluciones Tech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsable">Responsable</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Juan Pérez</SelectItem>
                      <SelectItem value="2">María García</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Proyecto</Label>
                <Input
                  id="nombre"
                  placeholder="Nombre del proyecto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaFin">Fecha Fin</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="presupuesto">Presupuesto</Label>
                  <Input
                    id="presupuesto"
                    type="number"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción detallada del proyecto..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button>
                  Crear Proyecto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Activos este trimestre
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Play className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.porEstado.find(e => e.estado === 'en_progreso')?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              En ejecución
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${stats.presupuestoTotal.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              En proyectos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.progresoPromedio}%
            </div>
            <p className="text-xs text-muted-foreground">
              De todos los proyectos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, cliente o responsable..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="planificacion">Planificación</SelectItem>
                <SelectItem value="en_progreso">En Progreso</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Proyectos List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proyectos.map((proyecto) => {
              const EstadoIcon = getEstadoIcon(proyecto.estado)
              return (
                <div
                  key={proyecto.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{proyecto.nombre}</h3>
                        <span className="text-sm text-muted-foreground">
                          - {proyecto.cliente}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {proyecto.descripcion}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {proyecto.responsable}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {proyecto.fechaInicio} - {proyecto.fechaFin}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          ${proyecto.presupuesto.toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progreso</span>
                          <span>{proyecto.progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${proyecto.progreso}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPrioridadBadge(proyecto.prioridad)}`}>
                      <Flag className="h-3 w-3" />
                      {proyecto.prioridad}
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(proyecto.estado)}`}>
                      <EstadoIcon className="h-3 w-3" />
                      {proyecto.estado}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

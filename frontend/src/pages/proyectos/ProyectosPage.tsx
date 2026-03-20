import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { proyectosService, type Proyecto, type CreateProyectoInput } from '../../services/proyectos.service'
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
  BarChart3,
  DollarSign,
  UserCheck,
  MapPin
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
import { toast } from 'sonner'

export default function ProyectosPage() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const queryClient = useQueryClient()

  // Queries
  const { data: proyectosData, isLoading, error } = useQuery({
    queryKey: ['proyectos', currentPage, search, estado],
    queryFn: () => proyectosService.getProyectos(currentPage, 10, search, estado),
  })

  const { data: stats } = useQuery({
    queryKey: ['proyectos-stats'],
    queryFn: () => proyectosService.getProyectosStats(),
  })

  // Mutations
  const createProyectoMutation = useMutation({
    mutationFn: (data: CreateProyectoInput) => proyectosService.createProyecto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] })
      queryClient.invalidateQueries({ queryKey: ['proyectos-stats'] })
      setIsCreateDialogOpen(false)
      toast.success('Proyecto creado exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear proyecto')
    },
  })

  const deleteProyectoMutation = useMutation({
    mutationFn: (id: string) => proyectosService.deleteProyecto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proyectos'] })
      queryClient.invalidateQueries({ queryKey: ['proyectos-stats'] })
      toast.success('Proyecto eliminado exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar proyecto')
    },
  })

  const getEstadoBadge = (estado: string) => {
    const colors = {
      propuesta: 'bg-blue-100 text-blue-800',
      aprobado: 'bg-green-100 text-green-800',
      iniciado: 'bg-purple-100 text-purple-800',
      en_progreso: 'bg-yellow-100 text-yellow-800',
      en_revision: 'bg-orange-100 text-orange-800',
      cerrado: 'bg-gray-100 text-gray-800',
      pausado: 'bg-red-100 text-red-800',
      cancelado: 'bg-red-200 text-red-900',
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getEstadoIcon = (estado: string) => {
    const icons = {
      propuesta: Calendar,
      aprobado: CheckCircle2,
      iniciado: Play,
      en_progreso: Play,
      en_revision: Clock,
      cerrado: CheckCircle2,
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

  const handleCreateProyecto = (data: CreateProyectoInput) => {
    createProyectoMutation.mutate(data)
  }

  const handleDeleteProyecto = (id: string) => {
    if (confirm('¿Está seguro de eliminar este proyecto?')) {
      deleteProyectoMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error al cargar proyectos</p>
      </div>
    )
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
            <CreateProyectoForm onSubmit={handleCreateProyecto} />
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
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
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
              {stats?.porEstado.find(e => e.estado === 'en_progreso')?.count || 0}
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
              ${stats?.presupuesto.total.toLocaleString() || 0}
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
              {Math.round((proyectosData?.data || []).reduce((acc, p) => acc + (p.progreso || 0), 0) / (proyectosData?.data?.length || 1))}%
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
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="propuesta">Propuesta</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="iniciado">Iniciado</SelectItem>
                <SelectItem value="en_progreso">En Progreso</SelectItem>
                <SelectItem value="en_revision">En Revisión</SelectItem>
                <SelectItem value="cerrado">Cerrado</SelectItem>
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
            {proyectosData?.data.map((proyecto) => {
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
                        {proyecto.codigo && (
                          <span className="text-sm text-muted-foreground">
                            ({proyecto.codigo})
                          </span>
                        )}
                        {proyecto.cliente && (
                          <span className="text-sm text-muted-foreground">
                            - {proyecto.cliente.razonSocial}
                          </span>
                        )}
                      </div>
                      {proyecto.descripcion && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {proyecto.descripcion}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        {proyecto.responsable && (
                          <div className="flex items-center gap-1">
                            <UserCheck className="h-3 w-3" />
                            {proyecto.responsable.nombre} {proyecto.responsable.apellido}
                          </div>
                        )}
                        {proyecto.area && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {proyecto.area.nombre}
                          </div>
                        )}
                        {proyecto.fechaInicio && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {proyecto.fechaInicio} - {proyecto.fechaFin || 'Sin fecha fin'}
                          </div>
                        )}
                        {proyecto.presupuesto && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${proyecto.presupuesto.toLocaleString()}
                          </div>
                        )}
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteProyecto(proyecto.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Pagination */}
          {proyectosData?.pagination && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Mostrando {proyectosData.data.length} de {proyectosData.pagination.total} proyectos
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {proyectosData.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === proyectosData.pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Form component for creating projects
function CreateProyectoForm({ onSubmit }: { onSubmit: (data: CreateProyectoInput) => void }) {
  const [formData, setFormData] = useState<CreateProyectoInput>({
    nombre: '',
    descripcion: '',
    codigo: '',
    clienteId: '',
    areaId: '',
    responsableId: '',
    estado: 'propuesta',
    prioridad: 'media',
    fechaInicio: '',
    fechaFin: '',
    presupuesto: undefined,
    notas: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del Proyecto</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Nombre del proyecto"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="codigo">Código</Label>
          <Input
            id="codigo"
            value={formData.codigo}
            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
            placeholder="Código del proyecto"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          placeholder="Descripción detallada del proyecto..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value as any })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="propuesta">Propuesta</SelectItem>
              <SelectItem value="aprobado">Aprobado</SelectItem>
              <SelectItem value="iniciado">Iniciado</SelectItem>
              <SelectItem value="en_progreso">En Progreso</SelectItem>
              <SelectItem value="en_revision">En Revisión</SelectItem>
              <SelectItem value="cerrado">Cerrado</SelectItem>
              <SelectItem value="pausado">Pausado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="prioridad">Prioridad</Label>
          <Select value={formData.prioridad} onValueChange={(value) => setFormData({ ...formData, prioridad: value as any })}>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaInicio">Fecha Inicio</Label>
          <Input
            id="fechaInicio"
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaFin">Fecha Fin</Label>
          <Input
            id="fechaFin"
            type="date"
            value={formData.fechaFin}
            onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="presupuesto">Presupuesto</Label>
          <Input
            id="presupuesto"
            type="number"
            placeholder="0.00"
            value={formData.presupuesto || ''}
            onChange={(e) => setFormData({ ...formData, presupuesto: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsable">Responsable</Label>
          <Select value={formData.responsableId} onValueChange={(value) => setFormData({ ...formData, responsableId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar responsable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="juan-perez">Juan Pérez</SelectItem>
              <SelectItem value="maria-garcia">María García</SelectItem>
              <SelectItem value="carlos-lopez">Carlos López</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notas">Notas</Label>
        <Textarea
          id="notas"
          value={formData.notas}
          onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
          placeholder="Notas adicionales..."
          rows={2}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={!formData.nombre}>
          Crear Proyecto
        </Button>
      </div>
    </form>
  )
}

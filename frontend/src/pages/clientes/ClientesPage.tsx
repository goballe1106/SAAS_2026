import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientesService, type Cliente, type CreateClienteInput } from '../../services/clientes.service'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { 
  Building2, 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Globe, 
  MapPin,
  Filter,
  Download,
  Eye,
  TrendingUp,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign
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

export default function ClientesPage() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')
  const [page, setPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState<CreateClienteInput>({
    razonSocial: '',
    estado: 'prospecto',
  })

  const queryClient = useQueryClient()

  // Queries
  const { data: clientesData, isLoading, error } = useQuery({
    queryKey: ['clientes', page, search, estado],
    queryFn: () => clientesService.getClientes(page, 10, search, estado),
  })

  const { data: stats } = useQuery({
    queryKey: ['clientes-stats'],
    queryFn: clientesService.getClientesStats,
  })

  // Mutations
  const createClienteMutation = useMutation({
    mutationFn: clientesService.createCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      queryClient.invalidateQueries({ queryKey: ['clientes-stats'] })
      setIsCreateDialogOpen(false)
      resetForm()
    },
  })

  const updateClienteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateClienteInput }) =>
      clientesService.updateCliente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      queryClient.invalidateQueries({ queryKey: ['clientes-stats'] })
      setEditingCliente(null)
      resetForm()
    },
  })

  const deleteClienteMutation = useMutation({
    mutationFn: clientesService.deleteCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      queryClient.invalidateQueries({ queryKey: ['clientes-stats'] })
    },
  })

  const resetForm = () => {
    setFormData({
      razonSocial: '',
      estado: 'prospecto',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCliente) {
      updateClienteMutation.mutate({ id: editingCliente.id, data: formData })
    } else {
      createClienteMutation.mutate(formData)
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData({
      ruc: cliente.ruc,
      razonSocial: cliente.razonSocial,
      nombreComercial: cliente.nombreComercial,
      direccion: cliente.direccion,
      telefono: cliente.telefon,
      email: cliente.email,
      web: cliente.web,
      estado: cliente.estado,
      sector: cliente.sector,
      actividad: cliente.actividad,
      descripcion: cliente.descripcion,
      notas: cliente.notas,
      areaId: cliente.areaId,
      responsableId: cliente.responsableId,
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      deleteClienteMutation.mutate(id)
    }
  }

  const getEstadoBadge = (estado: string) => {
    const colors = {
      prospecto: 'bg-yellow-100 text-yellow-800',
      activo: 'bg-green-100 text-green-800',
      inactivo: 'bg-gray-100 text-gray-800',
      potencial: 'bg-blue-100 text-blue-800',
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getEstadoIcon = (estado: string) => {
    const icons = {
      prospecto: Clock,
      activo: CheckCircle2,
      inactivo: UserX,
      potencial: TrendingUp,
    }
    return icons[estado as keyof typeof icons] || AlertCircle
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error al cargar clientes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gestión de clientes y contactos</p>
        </div>
        <Dialog open={isCreateDialogOpen || !!editingCliente} onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false)
            setEditingCliente(null)
            resetForm()
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ruc">RUC</Label>
                  <Input
                    id="ruc"
                    value={formData.ruc || ''}
                    onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                    placeholder="1234567890123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospecto">Prospecto</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="potencial">Potencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="razonSocial">Razón Social *</Label>
                <Input
                  id="razonSocial"
                  value={formData.razonSocial}
                  onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                  placeholder="Empresa S.A."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombreComercial">Nombre Comercial</Label>
                <Input
                  id="nombreComercial"
                  value={formData.nombreComercial || ''}
                  onChange={(e) => setFormData({ ...formData, nombreComercial: e.target.value })}
                  placeholder="Nombre Comercial"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono || ''}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+593 2 1234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@empresa.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion || ''}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Av. Principal 123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="web">Sitio Web</Label>
                <Input
                  id="web"
                  value={formData.web || ''}
                  onChange={(e) => setFormData({ ...formData, web: e.target.value })}
                  placeholder="https://www.empresa.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Input
                    id="sector"
                    value={formData.sector || ''}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    placeholder="Tecnología"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actividad">Actividad</Label>
                  <Input
                    id="actividad"
                    value={formData.actividad || ''}
                    onChange={(e) => setFormData({ ...formData, actividad: e.target.value })}
                    placeholder="Software"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion || ''}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción de la empresa..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  value={formData.notas || ''}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Notas adicionales..."
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    setEditingCliente(null)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createClienteMutation.isPending || updateClienteMutation.isPending}
                >
                  {createClienteMutation.isPending || updateClienteMutation.isPending ? (
                    'Guardando...'
                  ) : (
                    editingCliente ? 'Actualizar' : 'Crear'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.nuevosEsteMes} nuevos este mes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.porEstado.find(e => e.estado === 'activo')?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.porEstado.find(e => e.estado === 'activo')?.count || 0) / stats.total * 100)}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prospectos</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.porEstado.find(e => e.estado === 'prospecto')?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Clientes potenciales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Sector</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.porSector[0]?.sector || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.porSector[0]?.count || 0} empresas
              </p>
            </CardContent>
          </Card>
        </div>
      )}

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
                  placeholder="Buscar por razón social, RUC o email..."
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
                <SelectItem value="prospecto">Prospecto</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="potencial">Potencial</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clientes List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {clientesData?.data.map((cliente) => {
                  const EstadoIcon = getEstadoIcon(cliente.estado)
                  return (
                    <div
                      key={cliente.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{cliente.razonSocial}</h3>
                            {cliente.nombreComercial && (
                              <span className="text-sm text-muted-foreground">
                                ({cliente.nombreComercial})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            {cliente.ruc && (
                              <span>RUC: {cliente.ruc}</span>
                            )}
                            {cliente.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {cliente.email}
                              </div>
                            )}
                            {cliente.telefon && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {cliente.telefon}
                              </div>
                            )}
                            {cliente.web && (
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                <a href={cliente.web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  Sitio web
                                </a>
                              </div>
                            )}
                          </div>
                          {cliente.direccion && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              {cliente.direccion}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(cliente.estado)}`}>
                          <EstadoIcon className="h-3 w-3" />
                          {cliente.estado}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(cliente)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cliente.id)}
                          disabled={deleteClienteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {clientesData?.pagination && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {((page - 1) * 10) + 1} a {Math.min(page * 10, clientesData.pagination.total)} de {clientesData.pagination.total} clientes
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= clientesData.pagination.totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

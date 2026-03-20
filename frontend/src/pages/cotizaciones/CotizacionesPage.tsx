import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  Download,
  Eye,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  FileX
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

export default function CotizacionesPage() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getEstadoBadge = (estado: string) => {
    const colors = {
      borrador: 'bg-gray-100 text-gray-800',
      enviada: 'bg-blue-100 text-blue-800',
      aceptada: 'bg-green-100 text-green-800',
      rejectada: 'bg-red-100 text-red-800',
      convertida: 'bg-purple-100 text-purple-800',
    }
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getEstadoIcon = (estado: string) => {
    const icons = {
      borrador: FileText,
      enviada: Clock,
      aceptada: CheckCircle2,
      rejectada: FileX,
      convertida: FileCheck,
    }
    return icons[estado as keyof typeof icons] || AlertCircle
  }

  // Datos de ejemplo
  const cotizaciones = [
    {
      id: '1',
      codigo: 'COT-2024-001',
      cliente: 'Empresa ABC',
      titulo: 'Desarrollo de sitio web corporativo',
      estado: 'enviada',
      fechaEmision: '2024-03-20',
      fechaValidez: '2024-04-20',
      total: 15000.00,
      moneda: 'USD'
    },
    {
      id: '2',
      codigo: 'COT-2024-002',
      cliente: 'Soluciones Tech',
      titulo: 'Implementación ERP',
      estado: 'aceptada',
      fechaEmision: '2024-03-15',
      fechaValidez: '2024-04-15',
      total: 45000.00,
      moneda: 'USD'
    },
    {
      id: '3',
      codigo: 'COT-2024-003',
      cliente: 'Innovate Systems',
      titulo: 'Consultoría TI',
      estado: 'borrador',
      fechaEmision: '2024-03-18',
      fechaValidez: '2024-04-18',
      total: 8000.00,
      moneda: 'USD'
    }
  ]

  const stats = {
    total: 3,
    porEstado: [
      { estado: 'borrador', count: 1 },
      { estado: 'enviada', count: 1 },
      { estado: 'aceptada', count: 1 }
    ],
    totalValor: 68000.00,
    promedioValor: 22666.67
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cotizaciones</h1>
          <p className="text-muted-foreground">Gestión de cotizaciones y propuestas comerciales</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cotización
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nueva Cotización</DialogTitle>
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
                  <Label htmlFor="oportunidad">Oportunidad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar oportunidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Proyecto Web</SelectItem>
                      <SelectItem value="2">Implementación ERP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Título de la cotización"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaEmision">Fecha Emisión</Label>
                  <Input
                    id="fechaEmision"
                    type="date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaValidez">Fecha Validez</Label>
                  <Input
                    id="fechaValidez"
                    type="date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción detallada de la cotización..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="moneda">Moneda</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condiciones">Condiciones</Label>
                  <Input
                    id="condiciones"
                    placeholder="Condiciones de pago"
                  />
                </div>
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
                  Crear Cotización
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
            <CardTitle className="text-sm font-medium">Total Cotizaciones</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Activas este mes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aceptadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.porEstado.find(e => e.estado === 'aceptada')?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.porEstado.find(e => e.estado === 'aceptada')?.count || 0) / stats.total * 100)}% de conversión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${stats.totalValor.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              En pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${stats.promedioValor.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Por cotización
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
                  placeholder="Buscar por código, cliente o título..."
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
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="enviada">Enviada</SelectItem>
                <SelectItem value="aceptada">Aceptada</SelectItem>
                <SelectItem value="rejectada">Rechazada</SelectItem>
                <SelectItem value="convertida">Convertida</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cotizaciones List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Cotizaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cotizaciones.map((cotizacion) => {
              const EstadoIcon = getEstadoIcon(cotizacion.estado)
              return (
                <div
                  key={cotizacion.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{cotizacion.codigo}</h3>
                        <span className="text-sm text-muted-foreground">
                          - {cotizacion.cliente}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {cotizacion.titulo}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {cotizacion.fechaEmision}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Vence: {cotizacion.fechaValidez}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {cotizacion.moneda} {cotizacion.total.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(cotizacion.estado)}`}>
                      <EstadoIcon className="h-3 w-3" />
                      {cotizacion.estado}
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

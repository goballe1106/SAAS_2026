import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Ticket, Search, Plus, Edit, Trash2, Clock, AlertCircle, CheckCircle, XCircle,
  User, Calendar, ArrowRight, MessageSquare, Send
} from 'lucide-react'

const PRIORIDADES = [
  { value: 'baja', label: 'Baja', color: 'bg-green-100 text-green-700', desc: 'Sin urgencia' },
  { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-700', desc: 'En lo posible' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-700', desc: 'Urgente' },
  { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-700', desc: 'Crítico' },
]

// Tipos de tickets por área
const TIPOS_POR_AREA: Record<string, { value: string; label: string; icon: string }[]> = {
  ti: [
    { value: 'soporte', label: 'Soporte Técnico', icon: '💻' },
    { value: 'hardware', label: 'Hardware', icon: '🖥️' },
    { value: 'software', label: 'Software', icon: '📀' },
    { value: 'red', label: 'Red/Conectividad', icon: '🌐' },
    { value: 'seguridad', label: 'Seguridad', icon: '🔒' },
    { value: 'acceso', label: 'Solicitud de Acceso', icon: '🔑' },
    { value: 'inventario', label: 'Inventario TI', icon: '📦' },
  ],
  gth: [
    { value: 'vacaciones', label: 'Vacaciones', icon: '🏖️' },
    { value: 'permisos', label: 'Permisos', icon: '📅' },
    { value: 'payroll', label: 'Liquidación/Payroll', icon: '💰' },
    { value: 'beneficios', label: 'Beneficios', icon: '🎁' },
    { value: 'contratacion', label: 'Contratación', icon: '📝' },
    { value: 'capacitacion', label: 'Capacitación', icon: '📚' },
  ],
  cont: [
    { value: 'facturacion', label: 'Facturación', icon: '📄' },
    { value: 'pagos', label: 'Pagos', icon: '💳' },
    { value: 'consulta', label: 'Consulta Contable', icon: '🔍' },
    { value: 'reporte', label: 'Solicitud de Reporte', icon: '📊' },
    { value: 'retenciones', label: 'Retenciones', icon: '📋' },
  ],
  log: [
    { value: 'compra', label: 'Solicitud de Compra', icon: '🛒' },
    { value: 'inventario', label: 'Inventario', icon: '📦' },
    { value: 'entrega', label: 'Entrega de Materiales', icon: '🚚' },
    { value: 'proveedor', label: 'Gestión de Proveedores', icon: '🏭' },
    { value: 'almacen', label: 'Almacén', icon: '🏠' },
  ],
  ope: [
    { value: 'trabajo', label: 'Orden de Trabajo', icon: '🔧' },
    { value: 'bitacora', label: 'Bitácora', icon: '📖' },
    { value: 'reporte', label: 'Reporte de Avance', icon: '📊' },
    { value: 'recurso', label: 'Solicitud de Recurso', icon: '👷' },
    { value: 'seguridad', label: 'Seguridad', icon: '🦺' },
  ],
}

const AREAS = [
  { value: 'ti', label: 'TI - Tecnología', responsable: 'Carlos López' },
  { value: 'log', label: 'LOG - Logística', responsable: 'Ana Martínez' },
  { value: 'cont', label: 'CONT - Contabilidad', responsable: 'Roberto Sánchez' },
  { value: 'gth', label: 'GTH - RRHH', responsable: 'María Pérez' },
  { value: 'ope', label: 'OPE - Operaciones', responsable: 'Juan García' },
]

const ESTADOS_TICKET = [
  { value: 'abierto', label: 'Abierto', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  { value: 'asignado', label: 'Asignado', color: 'bg-blue-100 text-blue-700', icon: User },
  { value: 'en_proceso', label: 'En Proceso', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'pendiente', label: 'Pendiente Cliente', color: 'bg-purple-100 text-purple-700', icon: Clock },
  { value: 'resuelto', label: 'Resuelto', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'cerrado', label: 'Cerrado', color: 'bg-gray-100 text-gray-700', icon: CheckCircle },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-gray-200 text-gray-600', icon: XCircle },
]

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([
    { id: 1, titulo: 'No puedo acceder al sistema', descripcion: 'Me aparece error de credentials', prioridad: 'urgente', categoria: 'acceso', tipoLabel: 'Solicitud de Acceso', areaDestino: 'ti', estado: 'abierto', solicitante: 'Juan Pérez', fechaCreacion: '2026-03-21 09:30', comentarios: 3 },
    { id: 2, titulo: 'Impresora no funciona', descripcion: 'La impresora del 2do piso no imprime', prioridad: 'media', categoria: 'hardware', tipoLabel: 'Hardware', areaDestino: 'ti', estado: 'en_proceso', solicitante: 'María García', fechaCreacion: '2026-03-20 14:15', comentarios: 5 },
    { id: 3, titulo: 'Solicitud de licencia Adobe', descripcion: 'Necesito licencia para proyecto de diseño', prioridad: 'baja', categoria: 'software', tipoLabel: 'Software', areaDestino: 'ti', estado: 'resuelto', solicitante: 'Carlos López', fechaCreacion: '2026-03-19 10:00', comentarios: 2 },
    { id: 4, titulo: 'Solicitud de vacaciones', descripcion: 'Quiero tomar mis vacaciones en abril', prioridad: 'media', categoria: 'vacaciones', tipoLabel: 'Vacaciones', areaDestino: 'gth', estado: 'abierto', solicitante: 'Ana Martínez', fechaCreacion: '2026-03-21 08:00', comentarios: 1 },
    { id: 5, titulo: 'Factura pendiente de pago', descripcion: 'La factura F001-00045 está vencida', prioridad: 'alta', categoria: 'facturacion', tipoLabel: 'Facturación', areaDestino: 'cont', estado: 'pendiente', solicitante: 'Roberto Sánchez', fechaCreacion: '2026-03-20 11:00', comentarios: 2 },
  ])
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroArea, setFiltroArea] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({
    titulo: '', descripcion: '', prioridad: 'media', categoria: '', areaDestino: 'ti', solicitante: ''
  })

  // Obtener tipos según el área seleccionada
  const getTiposPorArea = (area: string) => {
    return TIPOS_POR_AREA[area] || []
  }

  // Cuando cambia el área, resetear la categoría
  const handleAreaChange = (area: string) => {
    setFormData({ ...formData, areaDestino: area, categoria: '' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tipoLabel = getTiposPorArea(formData.areaDestino).find(t => t.value === formData.categoria)?.label || formData.categoria
    const nuevo = { 
      ...formData, 
      tipoLabel,
      id: Date.now(), 
      estado: 'abierto', 
      fechaCreacion: new Date().toLocaleString(), 
      comentarios: 0 
    }
    setTickets([nuevo, ...tickets])
    setShowForm(false)
    setFormData({ titulo: '', descripcion: '', prioridad: 'media', categoria: '', areaDestino: 'ti', solicitante: '' })
  }

  const ticketsFiltrados = tickets.filter(t => {
    const matchSearch = t.titulo.toLowerCase().includes(search.toLowerCase()) || 
                       t.descripcion.toLowerCase().includes(search.toLowerCase())
    const matchEstado = !filtroEstado || t.estado === filtroEstado
    const matchArea = !filtroArea || t.areaDestino === filtroArea
    return matchSearch && matchEstado && matchArea
  })

  const stats = {
    abiertos: tickets.filter(t => t.estado === 'abierto').length,
    enProceso: tickets.filter(t => t.estado === 'en_proceso').length,
    pendientes: tickets.filter(t => t.estado === 'pendiente').length,
    resueltos: tickets.filter(t => t.estado === 'resuelto' || t.estado === 'cerrado').length,
  }

  const getPrioridad = (p: string) => PRIORIDADES.find(pr => pr.value === p)
  const getEstado = (e: string) => ESTADOS_TICKET.find(es => es.value === e)
  const getArea = (a: string) => AREAS.find(ar => ar.value === a)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="h-7 w-7 text-indigo-600" />
            Sistema de Tickets
          </h1>
          <p className="text-gray-500">Gestión de solicitudes por área</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Abiertos</p>
                <p className="text-3xl font-bold text-red-700">{stats.abiertos}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">En Proceso</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.enProceso}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Pendientes</p>
                <p className="text-3xl font-bold text-purple-700">{stats.pendientes}</p>
              </div>
              <Clock className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Resueltos</p>
                <p className="text-3xl font-bold text-green-700">{stats.resueltos}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Título *</label>
                <Input value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required placeholder="Descripción corta del problema" className="mt-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Área Destino *</label>
                  <select value={formData.areaDestino} onChange={(e) => handleAreaChange(e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {AREAS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de Solicitud *</label>
                  <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} required className="w-full mt-1 p-2 border rounded-md bg-white">
                    <option value="">Seleccionar tipo...</option>
                    {getTiposPorArea(formData.areaDestino).map(t => (
                      <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Prioridad</label>
                  <select value={formData.prioridad} onChange={(e) => setFormData({...formData, prioridad: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {PRIORIDADES.map(p => <option key={p.value} value={p.value}>{p.label} - {p.desc}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción Detallada *</label>
                <Textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} required className="mt-1" rows={4} placeholder="Describe detalladamente tu solicitud o problema..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                  <Send className="h-4 w-4 mr-2" /> Enviar Ticket
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar tickets..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <select value={filtroArea} onChange={(e) => setFiltroArea(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todas las áreas</option>
              {AREAS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todos los estados</option>
              {ESTADOS_TICKET.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({ticketsFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ticketsFiltrados.map((ticket) => {
              const prioridad = getPrioridad(ticket.prioridad)
              const estado = getEstado(ticket.estado)
              const area = getArea(ticket.areaDestino)
              const EstadoIcon = estado?.icon || AlertCircle
              
              return (
                <div key={ticket.id} className="border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${prioridad?.color}`}>
                            {prioridad?.label}
                          </span>
                          <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded flex items-center gap-1">
                            {area?.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {ticket.tipoLabel}
                          </span>
                        </div>
                        <h3 className="font-semibold mt-2 text-gray-900">{ticket.titulo}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ticket.descripcion}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {ticket.solicitante}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {ticket.fechaCreacion}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {ticket.comentarios} comentarios</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${estado?.color}`}>
                          <EstadoIcon className="h-4 w-4" />
                          {estado?.label}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
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

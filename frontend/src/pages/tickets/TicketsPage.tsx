import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Ticket, Search, Plus, Edit, Trash2, Clock, AlertCircle, CheckCircle } from 'lucide-react'

const PRIORIDADES = [
  { value: 'baja', label: 'Baja', color: 'bg-green-100 text-green-700' },
  { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-700' },
]

const ESTADOS = [
  { value: 'abierto', label: 'Abierto', icon: AlertCircle, color: 'text-red-500' },
  { value: 'en_proceso', label: 'En Proceso', icon: Clock, color: 'text-yellow-500' },
  { value: 'cerrado', label: 'Cerrado', icon: CheckCircle, color: 'text-green-500' },
]

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '', descripcion: '', prioridad: 'media', areaDestino: '', categoria: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setFormData({ titulo: '', descripcion: '', prioridad: 'media', areaDestino: '', categoria: '' })
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-500">Sistema de solicitudes entre áreas</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Ticket
        </Button>
      </div>

      {showForm && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle>Nuevo Ticket</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Título *</label>
                  <Input value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required className="mt-1" placeholder="Descripción corta del problema" />
                </div>
                <div>
                  <label className="text-sm font-medium">Prioridad</label>
                  <select value={formData.prioridad} onChange={(e) => setFormData({...formData, prioridad: e.target.value})} className="w-full mt-1 p-2 border rounded-md">
                    {PRIORIDADES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Área Destino</label>
                  <select value={formData.areaDestino} onChange={(e) => setFormData({...formData, areaDestino: e.target.value})} className="w-full mt-1 p-2 border rounded-md">
                    <option value="">Seleccionar...</option>
                    <option value="ti">TI - Tecnología</option>
                    <option value="log">LOG - Logística</option>
                    <option value="cont">CONT - Contabilidad</option>
                    <option value="gth">GTH - RRHH</option>
                    <option value="ope">OPE - Operaciones</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Categoría</label>
                  <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full mt-1 p-2 border rounded-md">
                    <option value="">Seleccionar...</option>
                    <option value="soporte">Soporte Técnico</option>
                    <option value="inventario">Solicitud de Inventario</option>
                    <option value="pago">Solicitud de Pago</option>
                    <option value="vacaciones">Vacaciones/Permisos</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="w-full mt-1 p-2 border rounded-md" rows={4} placeholder="Describe detalladamente tu solicitud..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600">Enviar Ticket</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Abiertos</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En Proceso</p>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cerrados</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar tickets..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary">Buscar</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay tickets</p>
          ) : (
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{ticket.titulo}</p>
                      <p className="text-sm text-gray-500">{ticket.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${PRIORIDADES.find(p => p.value === ticket.prioridad)?.color || 'bg-gray-100'}`}>
                      {ticket.prioridad}
                    </span>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

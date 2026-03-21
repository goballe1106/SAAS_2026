import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Wrench, Search, Plus, Edit, Trash2, Truck, Package, AlertTriangle, 
  CheckCircle, Clock, DollarSign, Calendar, MapPin, ClipboardList
} from 'lucide-react'

const ESTADOS = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'en_proceso', label: 'En Proceso', color: 'bg-blue-100 text-blue-700' },
  { value: 'completado', label: 'Completado', color: 'bg-green-100 text-green-700' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-700' },
]

const TIPOS = [
  'Mantenimiento Correctivo', 'Mantenimiento Preventivo', 'Instalación', 
  'Reparación', 'Inspección', 'Otro'
]

export default function OperacionesPage() {
  const [operaciones, setOperaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '', tipo: '', descripcion: '', prioridad: 'media',
    costo: 0, fechaProgramada: '', fechaRealizada: '',
    ubicacion: '', equipoId: '', notas: ''
  })

  const loadOperaciones = async () => {
    setLoading(true)
    // Simulated data
    setTimeout(() => {
      setOperaciones([])
      setLoading(false)
    }, 500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setFormData({
      titulo: '', tipo: '', descripcion: '', prioridad: 'media',
      costo: 0, fechaProgramada: '', fechaRealizada: '',
      ubicacion: '', equipoId: '', notas: ''
    })
    loadOperaciones()
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operaciones</h1>
          <p className="text-gray-500">Gestión de mantenimiento y operaciones</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Operación
        </Button>
      </div>

      {showForm && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="text-blue-900">Nueva Operación / Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Título *</label>
                  <Input value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required className="mt-1" placeholder="Cambio de filtro de aceite" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de Operación</label>
                  <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="w-full mt-1 p-2 border rounded-md">
                    <option value="">Seleccionar...</option>
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Prioridad</label>
                  <select value={formData.prioridad} onChange={(e) => setFormData({...formData, prioridad: e.target.value})} className="w-full mt-1 p-2 border rounded-md">
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Costo (S/)</label>
                  <Input type="number" value={formData.costo} onChange={(e) => setFormData({...formData, costo: parseFloat(e.target.value)})} className="mt-1" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha Programada</label>
                  <Input type="date" value={formData.fechaProgramada} onChange={(e) => setFormData({...formData, fechaProgramada: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha Realizada</label>
                  <Input type="date" value={formData.fechaRealizada} onChange={(e) => setFormData({...formData, fechaRealizada: e.target.value})} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Ubicación</label>
                <Input value={formData.ubicacion} onChange={(e) => setFormData({...formData, ubicacion: e.target.value})} className="mt-1" placeholder="Obra Lima Centro" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="w-full mt-1 p-2 border rounded-md" rows={3} placeholder="Descripción detallada de la operación..." />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Guardar Operación</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">{operaciones.length}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
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
                <p className="text-sm text-gray-500">En Proceso</p>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completados</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buscador */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar operaciones..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary" onClick={loadOperaciones}>Buscar</Button>
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Operaciones ({operaciones.length})</CardTitle>
          <CardDescription>Lista de operaciones y mantenimiento</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <p>Cargando...</p> : operaciones.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay operaciones registradas</p>
          ) : (
            <div className="space-y-2">
              {operaciones.map((op) => (
                <div key={op.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{op.titulo}</p>
                      <p className="text-sm text-gray-500">{op.tipo}</p>
                      <div className="flex gap-2 mt-1">
                        {op.fechaProgramada && <span className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-1"><Calendar className="h-3 w-3" /> {op.fechaProgramada}</span>}
                        {op.costo && <span className="text-xs bg-green-100 px-2 py-1 rounded flex items-center gap-1"><DollarSign className="h-3 w-3" /> S/{op.costo}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
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

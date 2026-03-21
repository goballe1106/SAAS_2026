import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  ShoppingCart, Search, Plus, Edit, Trash2, Package, Clock, CheckCircle, 
  XCircle, Truck, FileText, DollarSign, AlertTriangle
} from 'lucide-react'

const ESTADOS_COMPRA = [
  { value: 'solicitado', label: 'Solicitado', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'aprobado', label: 'Aprobado', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  { value: 'ordenado', label: 'Ordenado', color: 'bg-purple-100 text-purple-700', icon: FileText },
  { value: 'recibido', label: 'Recibido', color: 'bg-green-100 text-green-700', icon: Package },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-gray-100 text-gray-700', icon: XCircle },
]

const PRIORIDADES = [
  { value: 'baja', label: 'Baja', color: 'bg-green-100 text-green-700' },
  { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-700' },
]

export default function ComprasPage() {
  const [compras, setCompras] = useState<any[]>([
    { id: 1, numero: 'OC-001', proveedor: 'Distribuidor ABC', items: 'Cemento, Fierro', total: 5000, prioridad: 'alta', estado: 'aprobado', fechaSolicitud: '2026-03-15', fechaEntrega: '2026-03-20' },
    { id: 2, numero: 'OC-002', proveedor: 'Aceros Peru', items: 'Fierro corrugado 100 und', total: 4500, prioridad: 'media', estado: 'ordenado', fechaSolicitud: '2026-03-18', fechaEntrega: '2026-03-25' },
    { id: 3, numero: 'OC-003', proveedor: 'Seguridad Industrial', items: 'Cascos, Guantes, Chalecos', total: 1200, prioridad: 'baja', estado: 'solicitado', fechaSolicitud: '2026-03-20', fechaEntrega: '2026-03-30' },
  ])
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({
    proveedor: '', items: '', total: 0, prioridad: 'media', fechaEntrega: '', notas: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo = {
      ...formData,
      id: Date.now(),
      numero: `OC-${String(compras.length + 1).padStart(3, '0')}`,
      estado: 'solicitado',
      fechaSolicitud: new Date().toISOString().split('T')[0]
    }
    setCompras([nuevo, ...compras])
    setShowForm(false)
    setFormData({ proveedor: '', items: '', total: 0, prioridad: 'media', fechaEntrega: '', notas: '' })
  }

  const comprasFiltradas = compras.filter(c => 
    c.proveedor.toLowerCase().includes(search.toLowerCase()) || 
    c.numero.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    solicitadas: compras.filter(c => c.estado === 'solicitado').length,
    aprobadas: compras.filter(c => c.estado === 'aprobado').length,
    recibidas: compras.filter(c => c.estado === 'recibido').length,
    total: compras.reduce((acc, c) => acc + c.total, 0),
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-purple-600" />
            Compras
          </h1>
          <p className="text-gray-500">Gestión de órdenes de compra</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" /> Nueva Orden
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Órdenes</p>
                <p className="text-3xl font-bold text-purple-700">{compras.length}</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Solicitadas</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.solicitadas}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Aprobadas</p>
                <p className="text-3xl font-bold text-blue-700">{stats.aprobadas}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Valor</p>
                <p className="text-2xl font-bold text-green-700">S/ {stats.total.toLocaleString()}</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nueva Orden de Compra
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Proveedor *</label>
                  <Input value={formData.proveedor} onChange={(e) => setFormData({...formData, proveedor: e.target.value})} required className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Prioridad</label>
                  <select value={formData.prioridad} onChange={(e) => setFormData({...formData, prioridad: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {PRIORIDADES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha Entrega Esperada</label>
                  <Input type="date" value={formData.fechaEntrega} onChange={(e) => setFormData({...formData, fechaEntrega: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Monto Estimado (S/)</label>
                  <Input type="number" value={formData.total} onChange={(e) => setFormData({...formData, total: Number(e.target.value)})} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Items Solicitados</label>
                <Textarea value={formData.items} onChange={(e) => setFormData({...formData, items: e.target.value})} className="mt-1" rows={3} placeholder="Lista de items requeridos..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notas</label>
                <Textarea value={formData.notas} onChange={(e) => setFormData({...formData, notas: e.target.value})} className="mt-1" rows={2} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Crear Orden</Button>
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
                <Input placeholder="Buscar orden..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todos los estados</option>
              {ESTADOS_COMPRA.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Compra ({comprasFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {comprasFiltradas.map((compra) => {
              const estado = ESTADOS_COMPRA.find(e => e.value === compra.estado)
              const prioridad = PRIORIDADES.find(p => p.value === compra.prioridad)
              const EstadoIcon = estado?.icon || Clock
              return (
                <div key={compra.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-purple-600">{compra.numero}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${prioridad?.color}`}>{prioridad?.label}</span>
                        </div>
                        <p className="text-sm text-gray-600">{compra.proveedor}</p>
                        <p className="text-xs text-gray-500 mt-1">{compra.items}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">S/ {compra.total.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${estado?.color}`}>
                          <EstadoIcon className="h-4 w-4" />
                          {estado?.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Entrega: {compra.fechaEntrega}</p>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
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

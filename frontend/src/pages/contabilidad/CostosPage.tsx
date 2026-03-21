import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  CreditCard, Search, Plus, Edit, Trash2, DollarSign, Calendar, User, 
  Building2, TrendingUp, TrendingDown, Package, FileText, Receipt
} from 'lucide-react'

const CATEGORIAS_COSTO = [
  { value: 'materiales', label: 'Materiales', icon: Package, color: 'bg-blue-100 text-blue-700' },
  { value: 'mano_obra', label: 'Mano de Obra', icon: User, color: 'bg-green-100 text-green-700' },
  { value: 'equipos', label: 'Equipos', icon: Building2, color: 'bg-purple-100 text-purple-700' },
  { value: 'subcontratos', label: 'Subcontratos', icon: FileText, color: 'bg-orange-100 text-orange-700' },
  { value: 'indirectos', label: 'Gastos Indirectos', icon: Receipt, color: 'bg-gray-100 text-gray-700' },
  { value: 'otro', label: 'Otros', icon: DollarSign, color: 'bg-yellow-100 text-yellow-700' },
]

export default function CostosPage() {
  const [costos, setCostos] = useState<any[]>([
    { id: 1, proyecto: 'Obra Lima Centro', categoria: 'materiales', descripcion: 'Cemento Portland 50kg', cantidad: 100, unidad: 'bolsas', precioUnitario: 28, total: 2800, fecha: '2026-03-15' },
    { id: 2, proyecto: 'Obra Lima Centro', categoria: 'mano_obra', descripcion: 'Albañil - 5 días', cantidad: 5, unidad: 'días', precioUnitario: 200, total: 1000, fecha: '2026-03-16' },
    { id: 3, proyecto: 'Supervisión Javier Prado', categoria: 'equipos', descripcion: 'Alquiler retroexcavadora', cantidad: 3, unidad: 'días', precioUnitario: 450, total: 1350, fecha: '2026-03-18' },
    { id: 4, proyecto: 'Obra Lima Centro', categoria: 'subcontratos', descripcion: 'Instalación eléctrica', cantidad: 1, unidad: 'paquete', precioUnitario: 3500, total: 3500, fecha: '2026-03-19' },
  ])
  const [search, setSearch] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroProyecto, setFiltroProyecto] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({
    proyecto: '', categoria: 'materiales', descripcion: '', cantidad: 1, unidad: '', precioUnitario: 0, fecha: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo = {
      ...formData,
      id: Date.now(),
      total: formData.cantidad * formData.precioUnitario
    }
    setCostos([nuevo, ...costos])
    setShowForm(false)
    setFormData({ proyecto: '', categoria: 'materiales', descripcion: '', cantidad: 1, unidad: '', precioUnitario: 0, fecha: '' })
  }

  const costosFiltrados = costos.filter(c => {
    const matchSearch = c.descripcion.toLowerCase().includes(search.toLowerCase()) || c.proyecto.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filtroCategoria || c.categoria === filtroCategoria
    const matchProy = !filtroProyecto || c.proyecto === filtroProyecto
    return matchSearch && matchCat && matchProy
  })

  const proyectos = [...new Set(costos.map(c => c.proyecto))]

  const stats = {
    total: costos.reduce((acc, c) => acc + c.total, 0),
    materiales: costos.filter(c => c.categoria === 'materiales').reduce((acc, c) => acc + c.total, 0),
    manoObra: costos.filter(c => c.categoria === 'mano_obra').reduce((acc, c) => acc + c.total, 0),
    equipos: costos.filter(c => c.categoria === 'equipos').reduce((acc, c) => acc + c.total, 0),
  }

  // Costos por proyecto
  const porProyecto = proyectos.map(p => ({
    proyecto: p,
    total: costos.filter(c => c.proyecto === p).reduce((acc, c) => acc + c.total, 0)
  }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-7 w-7 text-orange-600" />
            Costos
          </h1>
          <p className="text-gray-500">Control de costos por proyecto</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Costo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Total Costos</p>
                <p className="text-2xl font-bold text-orange-700">S/ {stats.total.toLocaleString()}</p>
              </div>
              <DollarSign className="h-10 w-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Materiales</p>
                <p className="text-2xl font-bold text-blue-700">S/ {stats.materiales.toLocaleString()}</p>
              </div>
              <Package className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Mano de Obra</p>
                <p className="text-2xl font-bold text-green-700">S/ {stats.manoObra.toLocaleString()}</p>
              </div>
              <User className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Equipos</p>
                <p className="text-2xl font-bold text-purple-700">S/ {stats.equipos.toLocaleString()}</p>
              </div>
              <Building2 className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Registrar Costo
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Proyecto *</label>
                  <Input value={formData.proyecto} onChange={(e) => setFormData({...formData, proyecto: e.target.value})} required placeholder="Nombre del proyecto" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoría</label>
                  <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {CATEGORIAS_COSTO.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Descripción</label>
                  <Input value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} placeholder="Detalle del costo" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha</label>
                  <Input type="date" value={formData.fecha} onChange={(e) => setFormData({...formData, fecha: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Cantidad</label>
                  <Input type="number" value={formData.cantidad} onChange={(e) => setFormData({...formData, cantidad: Number(e.target.value)})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Unidad</label>
                  <Input value={formData.unidad} onChange={(e) => setFormData({...formData, unidad: e.target.value})} placeholder="kg, bolsas, días..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Precio Unitario (S/)</label>
                  <Input type="number" value={formData.precioUnitario} onChange={(e) => setFormData({...formData, precioUnitario: Number(e.target.value)})} className="mt-1" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">Registrar Costo</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Costos por Proyecto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Costos por Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {porProyecto.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{p.proyecto}</span>
                  <span className="font-bold text-orange-600">S/ {p.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Costos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {CATEGORIAS_COSTO.map((cat) => {
                const totalCat = costos.filter(c => c.categoria === cat.value).reduce((acc, c) => acc + c.total, 0)
                const Icono = cat.icon
                return (
                  <div key={cat.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`p-2 rounded-lg ${cat.color}`}>
                        <Icono className="h-4 w-4" />
                      </span>
                      <span className="text-sm">{cat.label}</span>
                    </div>
                    <span className="font-medium">S/ {totalCat.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar costo..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <select value={filtroProyecto} onChange={(e) => setFiltroProyecto(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todos los proyectos</option>
              {proyectos.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todas las categorías</option>
              {CATEGORIAS_COSTO.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Costos ({costosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Proyecto</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Categoría</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Descripción</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Cantidad</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">P. Unitario</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {costosFiltrados.map((c) => {
                  const cat = CATEGORIAS_COSTO.find(cat => cat.value === c.categoria)
                  return (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{c.proyecto}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${cat?.color}`}>
                          {cat?.label}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{c.descripcion}</td>
                      <td className="p-3">{c.cantidad} {c.unidad}</td>
                      <td className="p-3">S/ {c.precioUnitario.toLocaleString()}</td>
                      <td className="p-3 font-medium">S/ {c.total.toLocaleString()}</td>
                      <td className="p-3 text-sm">{c.fecha}</td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Monitor, Search, Plus, Edit, Trash2, Laptop, Server, Wifi, Smartphone, 
  Keyboard, Mouse, Printer, HardDrive, Tv, Package, AlertTriangle, CheckCircle,
  MapPin, User, Calendar, Filter
} from 'lucide-react'

const CATEGORIAS = [
  { value: 'computadora', label: 'Computadora', icon: Laptop },
  { value: 'servidor', label: 'Servidor', icon: Server },
  { value: 'laptop', label: 'Laptop', icon: Laptop },
  { value: 'monitor', label: 'Monitor', icon: Monitor },
  { value: 'impresora', label: 'Impresora', icon: Printer },
  { value: 'red', label: 'Equipo de Red', icon: Wifi },
  { value: 'celular', label: 'Celular', icon: Smartphone },
  { value: 'teclado', label: 'Teclado', icon: Keyboard },
  { value: 'mouse', label: 'Mouse', icon: Mouse },
  { value: 'almacenamiento', label: 'Almacenamiento', icon: HardDrive },
  { value: 'tv', label: 'TV/Proyector', icon: Tv },
  { value: 'otro', label: 'Otro', icon: Package },
]

const ESTADOS = [
  { value: 'disponible', label: 'Disponible', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'asignado', label: 'Asignado', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'mantenimiento', label: 'En Mantenimiento', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'baja', label: 'De Baja', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'robo', label: 'Robo/Pérdida', color: 'bg-red-200 text-red-800 border-red-300' },
]

const UBICACIONES = [
  { value: 'oficina_principal', label: 'Oficina Principal' },
  { value: 'oficina_secundaria', label: 'Oficina Secundaria' },
  { value: 'almacen', label: 'Almacén' },
  { value: 'campo', label: 'Campo' },
  { value: 'datacenter', label: 'Datacenter' },
]

export default function ActivosTIPage() {
  const [activos, setActivos] = useState<any[]>([
    { id: 1, codigo: 'TI-001', serie: 'SN123456', descripcion: 'Dell Latitude 5520', categoria: 'laptop', estado: 'asignado', responsable: 'Juan Pérez', ubicacion: 'oficina_principal', fechaAdquisicion: '2025-01-15', costo: 2500 },
    { id: 2, codigo: 'TI-002', serie: 'SN654321', descripcion: 'HP ProDesk 400', categoria: 'computadora', estado: 'disponible', responsable: '', ubicacion: 'almacen', fechaAdquisicion: '2024-06-20', costo: 1800 },
    { id: 3, codigo: 'TI-003', serie: 'SN111222', descripcion: 'Monitor Samsung 24"', categoria: 'monitor', estado: 'asignado', responsable: 'María García', ubicacion: 'oficina_principal', fechaAdquisicion: '2025-02-01', costo: 450 },
  ])
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    codigo: '', serie: '', descripcion: '', categoria: 'computadora', 
    estado: 'disponible', responsable: '', ubicacion: 'almacen', 
    fechaAdquisicion: '', costo: 0, marca: '', modelo: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevoActivo = { ...formData, id: Date.now() }
    setActivos([nuevoActivo, ...activos])
    setShowForm(false)
    setFormData({ codigo: '', serie: '', descripcion: '', categoria: 'computadora', estado: 'disponible', responsable: '', ubicacion: 'almacen', fechaAdquisicion: '', costo: 0, marca: '', modelo: '' })
  }

  const activosFiltrados = activos.filter(a => {
    const matchSearch = a.descripcion.toLowerCase().includes(search.toLowerCase()) || 
                       a.codigo.toLowerCase().includes(search.toLowerCase()) ||
                       a.serie.toLowerCase().includes(search.toLowerCase())
    const matchEstado = !filtroEstado || a.estado === filtroEstado
    const matchCategoria = !filtroCategoria || a.categoria === filtroCategoria
    return matchSearch && matchEstado && matchCategoria
  })

  const stats = {
    total: activos.length,
    disponibles: activos.filter(a => a.estado === 'disponible').length,
    asignados: activos.filter(a => a.estado === 'asignado').length,
    mantenimiento: activos.filter(a => a.estado === 'mantenimiento').length,
  }

  const getIcono = (cat: string) => {
    const c = CATEGORIAS.find(c => c.value === cat)
    return c?.icon || Package
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Monitor className="h-7 w-7 text-blue-600" />
            Inventario TI
          </h1>
          <p className="text-gray-500">Gestión de activos tecnológicos y equipos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Activo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Activos</p>
                <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <Package className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Disponibles</p>
                <p className="text-3xl font-bold text-green-700">{stats.disponibles}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Asignados</p>
                <p className="text-3xl font-bold text-purple-700">{stats.asignados}</p>
              </div>
              <User className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">En Mantenimiento</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.mantenimiento}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {formData.id ? 'Editar Activo' : 'Nuevo Activo TI'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Código *</label>
                  <Input value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value})} required placeholder="TI-001" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Número de Serie</label>
                  <Input value={formData.serie} onChange={(e) => setFormData({...formData, serie: e.target.value})} placeholder="SN123456" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoría *</label>
                  <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Marca</label>
                  <Input value={formData.marca} onChange={(e) => setFormData({...formData, marca: e.target.value})} placeholder="Dell, HP, Lenovo..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Modelo</label>
                  <Input value={formData.modelo} onChange={(e) => setFormData({...formData, modelo: e.target.value})} placeholder="Latitude 5520..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <select value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Ubicación</label>
                  <select value={formData.ubicacion} onChange={(e) => setFormData({...formData, ubicacion: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {UBICACIONES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Responsable</label>
                  <Input value={formData.responsable} onChange={(e) => setFormData({...formData, responsable: e.target.value})} placeholder="Nombre del responsable" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha Adquisición</label>
                  <Input type="date" value={formData.fechaAdquisicion} onChange={(e) => setFormData({...formData, fechaAdquisicion: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Costo (S/)</label>
                  <Input type="number" value={formData.costo} onChange={(e) => setFormData({...formData, costo: Number(e.target.value)})} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="w-full mt-1 p-2 border rounded-md" rows={2} placeholder="Descripción detallada del equipo..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Guardar Activo</Button>
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
              <label className="text-sm font-medium text-gray-600">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Código, serie, descripción..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="w-40">
              <label className="text-sm font-medium text-gray-600">Estado</label>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-white">
                <option value="">Todos</option>
                {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
            <div className="w-40">
              <label className="text-sm font-medium text-gray-600">Categoría</label>
              <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-white">
                <option value="">Todas</option>
                {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Activos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Activos ({activosFiltrados.length})</span>
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" /> Exportar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Código</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Equipo</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Serie</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Estado</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Responsable</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Ubicación</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Costo</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {activosFiltrados.map((activo) => {
                  const Icono = getIcono(activo.categoria)
                  const estado = ESTADOS.find(e => e.value === activo.estado)
                  return (
                    <tr key={activo.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <span className="font-medium text-blue-600">{activo.codigo}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Icono className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{activo.descripcion}</p>
                            <p className="text-xs text-gray-500">{activo.marca} {activo.modelo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{activo.serie}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${estado?.color || 'bg-gray-100'}`}>
                          {estado?.label || activo.estado}
                        </span>
                      </td>
                      <td className="p-3">
                        {activo.responsable ? (
                          <div className="flex items-center gap-1 text-gray-600">
                            <User className="h-3 w-3" />
                            {activo.responsable}
                          </div>
                        ) : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {UBICACIONES.find(u => u.value === activo.ubicacion)?.label || activo.ubicacion}
                        </div>
                      </td>
                      <td className="p-3 font-medium">S/ {activo.costo.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
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

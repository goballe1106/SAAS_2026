import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Package, Search, Plus, Edit, Trash2, AlertTriangle, CheckCircle, Clock, 
  Box, Layers, Warehouse, TrendingDown, TrendingUp, XCircle
} from 'lucide-react'

const CATEGORIAS = [
  { value: 'herramientas', label: 'Herramientas', icon: Package },
  { value: 'materiales', label: 'Materiales de Construcción', icon: Layers },
  { value: 'equipos', label: 'Equipos de Protección', icon: Package },
  { value: 'insumos', label: 'Insumos', icon: Box },
  { value: 'repuestos', label: 'Repuestos', icon: Package },
]

const UBICACIONES = [
  { value: 'almacen_principal', label: 'Almacén Principal' },
  { value: 'almacen_obra', label: 'Almacén de Obra' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'campo', label: 'Campo' },
]

export default function InventarioPage() {
  const [items, setItems] = useState<any[]>([
    { id: 1, codigo: 'INV-001', nombre: 'Cemento Portland 50kg', categoria: 'materiales', stock: 150, stockMin: 50, unidad: 'bolsas', ubicacion: 'almacen_principal', costo: 28, proveedor: 'Distribuidor ABC' },
    { id: 2, codigo: 'INV-002', nombre: 'Fierro corrugado 12mm', categoria: 'materiales', stock: 80, stockMin: 100, unidad: 'varillas', ubicacion: 'almacen_principal', costo: 45, proveedor: 'Aceros Peru' },
    { id: 3, codigo: 'INV-003', nombre: 'Casco de seguridad', categoria: 'equipos', stock: 25, stockMin: 20, unidad: 'unidades', ubicacion: 'almacen_principal', costo: 35, proveedor: 'Seguridad Industrial' },
    { id: 4, codigo: 'INV-004', nombre: 'Arena fina', categoria: 'materiales', stock: 20, stockMin: 30, unidad: 'm3', ubicacion: 'almacen_obra', costo: 80, proveedor: 'Cantera XYZ' },
  ])
  const [search, setSearch] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({
    codigo: '', nombre: '', categoria: 'materiales', stock: 0, stockMin: 0, unidad: '', ubicacion: 'almacen_principal', costo: 0, proveedor: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo = { ...formData, id: Date.now() }
    setItems([nuevo, ...items])
    setShowForm(false)
    setFormData({ codigo: '', nombre: '', categoria: 'materiales', stock: 0, stockMin: 0, unidad: '', ubicacion: 'almacen_principal', costo: 0, proveedor: '' })
  }

  const itemsFiltrados = items.filter(i => 
    i.nombre.toLowerCase().includes(search.toLowerCase()) || 
    i.codigo.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: items.length,
    bajoStock: items.filter(i => i.stock < i.stockMin).length,
    sinStock: items.filter(i => i.stock === 0).length,
    valorTotal: items.reduce((acc, i) => acc + (i.stock * i.costo), 0),
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Warehouse className="h-7 w-7 text-blue-600" />
            Inventario General
          </h1>
          <p className="text-gray-500">Gestión de inventario y materiales</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Items</p>
                <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <Package className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Bajo Stock</p>
                <p className="text-3xl font-bold text-red-700">{stats.bajoStock}</p>
              </div>
              <TrendingDown className="h-10 w-10 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Sin Stock</p>
                <p className="text-3xl font-bold text-gray-700">{stats.sinStock}</p>
              </div>
              <XCircle className="h-10 w-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Valor Total</p>
                <p className="text-2xl font-bold text-green-700">S/ {stats.valorTotal.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Item
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Código</label>
                  <Input value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value})} placeholder="INV-001" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre *</label>
                  <Input value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoría</label>
                  <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Stock</label>
                  <Input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Stock Mínimo</label>
                  <Input type="number" value={formData.stockMin} onChange={(e) => setFormData({...formData, stockMin: Number(e.target.value)})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Unidad</label>
                  <Input value={formData.unidad} onChange={(e) => setFormData({...formData, unidad: e.target.value})} placeholder="kg, bolsas, unidades..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Ubicación</label>
                  <select value={formData.ubicacion} onChange={(e) => setFormData({...formData, ubicacion: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {UBICACIONES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Costo Unitario</label>
                  <Input type="number" value={formData.costo} onChange={(e) => setFormData({...formData, costo: Number(e.target.value)})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Proveedor</label>
                  <Input value={formData.proveedor} onChange={(e) => setFormData({...formData, proveedor: e.target.value})} className="mt-1" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Guardar</Button>
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
                <Input placeholder="Buscar item..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todas las categorías</option>
              {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario ({itemsFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Código</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Nombre</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Categoría</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Stock</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Ubicación</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Costo</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Proveedor</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {itemsFiltrados.map((item) => {
                  const bajoStock = item.stock < item.stockMin
                  return (
                    <tr key={item.id} className={`border-b hover:bg-gray-50 ${bajoStock ? 'bg-red-50' : ''}`}>
                      <td className="p-3 font-medium text-blue-600">{item.codigo}</td>
                      <td className="p-3 font-medium">{item.nombre}</td>
                      <td className="p-3">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {CATEGORIAS.find(c => c.value === item.categoria)?.label}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${bajoStock ? 'text-red-600' : ''}`}>{item.stock}</span>
                          <span className="text-gray-400 text-xs">/ {item.stockMin} min</span>
                          {item.stock === 0 && <XCircle className="h-4 w-4 text-red-500" />}
                          {bajoStock && item.stock > 0 && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        </div>
                      </td>
                      <td className="p-3 text-sm">{UBICACIONES.find(u => u.value === item.ubicacion)?.label}</td>
                      <td className="p-3">S/ {item.costo}</td>
                      <td className="p-3 text-sm">{item.proveedor}</td>
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

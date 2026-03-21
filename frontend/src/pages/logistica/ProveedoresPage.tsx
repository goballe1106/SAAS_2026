import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, Search, Plus, Edit, Trash2, Phone, Mail, MapPin, Building2, 
  Contact, CheckCircle, XCircle, Star
} from 'lucide-react'

const CATEGORIAS_PROV = [
  { value: 'materiales', label: 'Materiales de Construcción' },
  { value: 'herramientas', label: 'Herramientas' },
  { value: 'equipos', label: 'Equipos y Maquinarias' },
  { value: 'seguridad', label: 'Equipos de Protección' },
  { value: 'electricidad', label: 'Materiales Eléctricos' },
  { value: 'plomeria', label: 'Plomería' },
  { value: 'pintura', label: 'Pinturas y Acabados' },
  { value: 'otro', label: 'Otros' },
]

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<any[]>([
    { id: 1, nombre: 'Distribuidor ABC S.A.C.', ruc: '20123456789', categoria: 'materiales', contacto: 'Juan Pérez', telefono: '987654321', email: 'juan@distribuidorabc.com', direccion: 'Av. Principal 123', calificacion: 5, estado: 'activo' },
    { id: 2, nombre: 'Aceros Peru S.A.', ruc: '20198765432', categoria: 'materiales', contacto: 'María García', telefono: '987654322', email: 'maria@acerosperu.com', direccion: 'Av. Industrial 456', calificacion: 4, estado: 'activo' },
    { id: 3, nombre: 'Seguridad Industrial Ltda.', ruc: '20456789123', categoria: 'seguridad', contacto: 'Carlos López', telefono: '987654323', email: 'carlos@seguridadindustrial.com', direccion: 'Av. Seguridad 789', calificacion: 4, estado: 'activo' },
    { id: 4, nombre: 'Ferretería Central', ruc: '10234567890', categoria: 'herramientas', contacto: 'Ana Martínez', telefono: '987654324', email: 'ana@ferreteriacentral.com', direccion: 'Jr. Central 234', calificacion: 3, estado: 'inactivo' },
  ])
  const [search, setSearch] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({
    nombre: '', ruc: '', categoria: 'materiales', contacto: '', telefono: '', email: '', direccion: '', notas: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo = { ...formData, id: Date.now(), calificacion: 0, estado: 'activo' }
    setProveedores([nuevo, ...proveedores])
    setShowForm(false)
    setFormData({ nombre: '', ruc: '', categoria: 'materiales', contacto: '', telefono: '', email: '', direccion: '', notas: '' })
  }

  const proveedoresFiltrados = proveedores.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase()) || 
    p.ruc.includes(search) ||
    p.contacto.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: proveedores.length,
    activos: proveedores.filter(p => p.estado === 'activo').length,
    promedioCalificacion: (proveedores.reduce((acc, p) => acc + p.calificacion, 0) / proveedores.length).toFixed(1),
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-7 w-7 text-indigo-600" />
            Proveedores
          </h1>
          <p className="text-gray-500">Gestión de proveedores y contactos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Proveedor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-600 font-medium">Total Proveedores</p>
                <p className="text-3xl font-bold text-indigo-700">{stats.total}</p>
              </div>
              <Users className="h-10 w-10 text-indigo-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Activos</p>
                <p className="text-3xl font-bold text-green-700">{stats.activos}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Calificación Promedio</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.promedioCalificacion} ⭐</p>
              </div>
              <Star className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Proveedor
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Razón Social *</label>
                  <Input value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">RUC</label>
                  <Input value={formData.ruc} onChange={(e) => setFormData({...formData, ruc: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoría</label>
                  <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {CATEGORIAS_PROV.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Persona de Contacto</label>
                  <Input value={formData.contacto} onChange={(e) => setFormData({...formData, contacto: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Teléfono</label>
                  <Input value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Dirección</label>
                <Input value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notas</label>
                <Textarea value={formData.notas} onChange={(e) => setFormData({...formData, notas: e.target.value})} className="mt-1" rows={2} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Guardar</Button>
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
                <Input placeholder="Buscar proveedor..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todas las categorías</option>
              {CATEGORIAS_PROV.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Proveedores ({proveedoresFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proveedoresFiltrados.map((prov) => (
              <div key={prov.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{prov.nombre}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${prov.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {prov.estado}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">RUC: {prov.ruc}</p>
                      <p className="text-sm text-gray-600 mt-1">{CATEGORIAS_PROV.find(c => c.value === prov.categoria)?.label}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {renderStars(prov.calificacion)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                  <div className="flex flex-wrap gap-3">
                    {prov.contacto && (
                      <span className="flex items-center gap-1"><Contact className="h-3 w-3" /> {prov.contacto}</span>
                    )}
                    {prov.telefono && (
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {prov.telefono}</span>
                    )}
                    {prov.email && (
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {prov.email}</span>
                    )}
                  </div>
                  {prov.direccion && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {prov.direccion}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

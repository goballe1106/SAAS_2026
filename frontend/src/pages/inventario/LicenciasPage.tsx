import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Key, Search, Plus, Edit, Trash2, AlertCircle, Clock, CheckCircle, XCircle,
  User, Calendar, Tag, Package
} from 'lucide-react'

const TIPOS_LICENCIA = [
  { value: 'usuario', label: 'Por usuario', desc: 'Licencia individual' },
  { value: 'dispositivo', label: 'Por dispositivo', desc: 'Licencia por equipo' },
  { value: 'corporativa', label: 'Corporativa', desc: 'Licencia global' },
  { value: 'saas', label: 'SaaS/Suscripción', desc: 'Servicio en la nube' },
]

const ESTADOS_LIC = [
  { value: 'activa', label: 'Activa', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'expirada', label: 'Expirada', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'por_vencer', label: 'Por vencer', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'cancelada', label: 'Cancelada', color: 'bg-gray-100 text-gray-700 border-gray-200' },
]

export default function LicenciasPage() {
  const [licencias, setLicencias] = useState<any[]>([
    { id: 1, nombre: 'Microsoft 365 Business', proveedor: 'Microsoft', tipo: 'corporativa', seats: 50, seatsUsados: 35, costo: 1200, fechaInicio: '2025-01-01', fechaVencimiento: '2026-01-01', estado: 'activa', responsable: 'TI' },
    { id: 2, nombre: 'Adobe Creative Cloud', proveedor: 'Adobe', tipo: 'usuario', seats: 10, seatsUsados: 8, costo: 800, fechaInicio: '2025-03-15', fechaVencimiento: '2026-03-15', estado: 'activa', responsable: 'Diseño' },
    { id: 3, nombre: 'Autodesk AutoCAD', proveedor: 'Autodesk', tipo: 'usuario', seats: 5, seatsUsados: 5, costo: 1500, fechaInicio: '2025-06-01', fechaVencimiento: '2026-02-28', estado: 'por_vencer', responsable: 'Ingeniería' },
  ])
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({
    nombre: '', proveedor: '', tipo: 'usuario', seats: 1, costo: 0, 
    fechaInicio: '', fechaVencimiento: '', responsable: '', descripcion: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nueva = { ...formData, id: Date.now(), seatsUsados: 0, estado: 'activa' }
    setLicencias([nueva, ...licencias])
    setShowForm(false)
    setFormData({ nombre: '', proveedor: '', tipo: 'usuario', seats: 1, costo: 0, fechaInicio: '', fechaVencimiento: '', responsable: '', descripcion: '' })
  }

  const licFiltradas = licencias.filter(l => 
    l.nombre.toLowerCase().includes(search.toLowerCase()) || 
    l.proveedor.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: licencias.length,
    activas: licencias.filter(l => l.estado === 'activa').length,
    porVencer: licencias.filter(l => l.estado === 'por_vencer').length,
    costoTotal: licencias.reduce((acc, l) => acc + l.costo, 0),
  }

  const getDiasRestantes = (fechaVenc: string) => {
    const hoy = new Date()
    const vence = new Date(fechaVenc)
    return Math.ceil((vence.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Key className="h-7 w-7 text-purple-600" />
            Licencias de Software
          </h1>
          <p className="text-gray-500">Gestión de licencias y suscripciones</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" /> Nueva Licencia
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Licencias</p>
                <p className="text-3xl font-bold text-purple-700">{stats.total}</p>
              </div>
              <Key className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Activas</p>
                <p className="text-3xl font-bold text-green-700">{stats.activas}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Por Vencer</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.porVencer}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Costo Anual</p>
                <p className="text-2xl font-bold text-blue-700">S/ {stats.costoTotal.toLocaleString()}</p>
              </div>
              <Package className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nueva Licencia
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Software *</label>
                  <Input value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required placeholder="Microsoft 365..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Proveedor</label>
                  <Input value={formData.proveedor} onChange={(e) => setFormData({...formData, proveedor: e.target.value})} placeholder="Microsoft, Adobe..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {TIPOS_LICENCIA.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">N° Licencias/Seats</label>
                  <Input type="number" value={formData.seats} onChange={(e) => setFormData({...formData, seats: Number(e.target.value)})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Costo (S/)</label>
                  <Input type="number" value={formData.costo} onChange={(e) => setFormData({...formData, costo: Number(e.target.value)})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Área Responsable</label>
                  <Input value={formData.responsable} onChange={(e) => setFormData({...formData, responsable: e.target.value})} placeholder="TI, Diseño, Ingeniería..." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha Inicio</label>
                  <Input type="date" value={formData.fechaInicio} onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha Vencimiento</label>
                  <Input type="date" value={formData.fechaVencimiento} onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="w-full mt-1 p-2 border rounded-md" rows={2} placeholder="Detalles adicionales..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Guardar</Button>
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
                <Input placeholder="Buscar licencia..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todos los estados</option>
              {ESTADOS_LIC.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Licencias ({licFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Software</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Proveedor</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Tipo</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Seats</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Vencimiento</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Estado</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Costo</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {licFiltradas.map((lic) => {
                  const estado = ESTADOS_LIC.find(e => e.value === lic.estado)
                  const dias = getDiasRestantes(lic.fechaVencimiento)
                  return (
                    <tr key={lic.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">{lic.nombre}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{lic.proveedor}</td>
                      <td className="p-3">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {TIPOS_LICENCIA.find(t => t.value === lic.tipo)?.label}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium">{lic.seatsUsados}</span>
                        <span className="text-gray-400">/{lic.seats}</span>
                      </td>
                      <td className="p-3">
                        <div>
                          <span className="text-sm">{lic.fechaVencimiento}</span>
                          {dias > 0 && dias <= 30 && (
                            <span className="ml-2 text-xs text-yellow-600">({dias} días)</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${estado?.color}`}>
                          {estado?.label}
                        </span>
                      </td>
                      <td className="p-3 font-medium">S/ {lic.costo.toLocaleString()}</td>
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

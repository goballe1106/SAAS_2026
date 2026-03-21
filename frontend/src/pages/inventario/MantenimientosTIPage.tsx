import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { 
  Wrench, Search, Plus, Edit, Trash2, Calendar, Clock, CheckCircle, AlertTriangle,
  User, Package, FileText, Play, Pause, XCircle
} from 'lucide-react'

const TIPOS_MANTENIMIENTO = [
  { value: 'preventivo', label: 'Preventivo', color: 'bg-blue-100 text-blue-700' },
  { value: 'correctivo', label: 'Correctivo', color: 'bg-red-100 text-red-700' },
  { value: 'predictivo', label: 'Predictivo', color: 'bg-purple-100 text-purple-700' },
]

const ESTADOS_MANT = [
  { value: 'programado', label: 'Programado', color: 'bg-yellow-100 text-yellow-700', icon: Calendar },
  { value: 'en_proceso', label: 'En Proceso', color: 'bg-blue-100 text-blue-700', icon: Play },
  { value: 'completado', label: 'Completado', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-gray-100 text-gray-700', icon: XCircle },
]

export default function MantenimientosTIPage() {
  const [mantenimientos, setMantenimientos] = useState<any>([
    { id: 1, activo: 'TI-001', descripcion: 'Cambio de pasta térmica', tipo: 'preventivo', estado: 'programado', responsable: 'Juan Pérez', fechaProgramada: '2026-03-25', costo: 150 },
    { id: 2, activo: 'TI-002', descripcion: 'Reparación de disco duro', tipo: 'correctivo', estado: 'en_proceso', responsable: 'Carlos López', fechaProgramada: '2026-03-20', costo: 300 },
  ])
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    activoId: '', descripcion: '', tipo: 'preventivo', estado: 'programado', 
    responsable: '', fechaProgramada: '', costo: 0, observaciones: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo = { ...formData, id: Date.now() }
    setMantenimientos([nuevo, ...mantenimientos])
    setShowForm(false)
    setFormData({ activoId: '', descripcion: '', tipo: 'preventivo', estado: 'programado', responsable: '', fechaProgramada: '', costo: 0, observaciones: '' })
  }

  const mantFiltrados = mantenimientos.filter(m => 
    m.descripcion.toLowerCase().includes(search.toLowerCase()) || m.activo.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: mantenimientos.length,
    programados: mantenimientos.filter(m => m.estado === 'programado').length,
    enProceso: mantenimientos.filter(m => m.estado === 'en_proceso').length,
    completados: mantenimientos.filter(m => m.estado === 'completado').length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wrench className="h-7 w-7 text-orange-600" />
            Mantenimientos TI
          </h1>
          <p className="text-gray-500">Programación y seguimiento de mantenimientos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Mantenimiento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Total</p>
                <p className="text-3xl font-bold text-orange-700">{stats.total}</p>
              </div>
              <Wrench className="h-10 w-10 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Programados</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.programados}</p>
              </div>
              <Calendar className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">En Proceso</p>
                <p className="text-3xl font-bold text-blue-700">{stats.enProceso}</p>
              </div>
              <Clock className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completados</p>
                <p className="text-3xl font-bold text-green-700">{stats.completados}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Mantenimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Activo *</label>
                  <Input value={formData.activoId} onChange={(e) => setFormData({...formData, activoId: e.target.value})} required placeholder="TI-001" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {TIPOS_MANTENIMIENTO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <select value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {ESTADOS_MANT.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Responsable</label>
                  <Input value={formData.responsable} onChange={(e) => setFormData({...formData, responsable: e.target.value})} placeholder="Técnico responsable" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha Programada</label>
                  <Input type="date" value={formData.fechaProgramada} onChange={(e) => setFormData({...formData, fechaProgramada: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Costo Estimado (S/)</label>
                  <Input type="number" value={formData.costo} onChange={(e) => setFormData({...formData, costo: Number(e.target.value)})} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción del Trabajo</label>
                <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="w-full mt-1 p-2 border rounded-md" rows={2} placeholder="Descripción del mantenimiento a realizar..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Observaciones</label>
                <textarea value={formData.observaciones} onChange={(e) => setFormData({...formData, observaciones: e.target.value})} className="w-full mt-1 p-2 border rounded-md" rows={2} placeholder="Notas adicionales..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">Guardar</Button>
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
                <Input placeholder="Buscar mantenimiento..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todos los estados</option>
              {ESTADOS_MANT.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Mantenimientos ({mantFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mantFiltrados.map((mant) => {
              const estado = ESTADOS_MANT.find(e => e.value === mant.estado)
              const tipo = TIPOS_MANTENIMIENTO.find(t => t.value === mant.tipo)
              const Icono = estado?.icon || Calendar
              return (
                <div key={mant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{mant.activo}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${tipo?.color}`}>{tipo?.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">{mant.descripcion}</p>
                      <div className="flex gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {mant.responsable}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {mant.fechaProgramada}</span>
                        <span className="flex items-center gap-1">S/ {mant.costo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${estado?.color}`}>
                      <Icono className="h-4 w-4" />
                      {estado?.label}
                    </span>
                    <div className="flex gap-1">
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

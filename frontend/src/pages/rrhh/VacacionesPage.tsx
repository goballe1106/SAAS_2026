import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Calendar, Search, Plus, Edit, Trash2, User, CheckCircle, Clock, 
  AlertTriangle, XCircle
} from 'lucide-react'

const ESTADOS_VACACION = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'aprobado', label: 'Aprobado', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'rechazado', label: 'Rechazado', color: 'bg-red-100 text-red-700', icon: XCircle },
  { value: 'aprovechado', label: 'Aprovechado', color: 'bg-blue-100 text-blue-700', icon: Palmtree },
]

export default function VacacionesPage() {
  const [vacaciones, setVacaciones] = useState<any[]>([
    { id: 1, empleado: 'Juan Pérez', area: 'Operaciones', dias: 15, fechaInicio: '2026-04-01', fechaFin: '2026-04-15', estado: 'aprobado', solicitante: 'Juan Pérez', fechaSolicitud: '2026-03-10' },
    { id: 2, empleado: 'María García', area: 'Contabilidad', dias: 7, fechaInicio: '2026-04-20', fechaFin: '2026-04-26', estado: 'pendiente', solicitante: 'María García', fechaSolicitud: '2026-03-15' },
    { id: 3, empleado: 'Carlos López', area: 'TI', dias: 30, fechaInicio: '2026-05-01', fechaFin: '2026-05-30', estado: 'pendiente', solicitante: 'Carlos López', fechaSolicitud: '2026-03-18' },
    { id: 4, empleado: 'Ana Martínez', area: 'RRHH', dias: 10, fechaInicio: '2026-03-01', fechaFin: '2026-03-10', estado: 'aprovechado', solicitante: 'Ana Martínez', fechaSolicitud: '2026-02-15' },
  ])
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({
    empleado: '', area: '', dias: 0, fechaInicio: '', fechaFin: '', motivo: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo = {
      ...formData,
      id: Date.now(),
      estado: 'pendiente',
      solicitante: formData.empleado,
      fechaSolicitud: new Date().toISOString().split('T')[0]
    }
    setVacaciones([nuevo, ...vacaciones])
    setShowForm(false)
    setFormData({ empleado: '', area: '', dias: 0, fechaInicio: '', fechaFin: '', motivo: '' })
  }

  const stats = {
    pendientes: vacaciones.filter(v => v.estado === 'pendiente').length,
    aprobados: vacaciones.filter(v => v.estado === 'aprobado').length,
    aprovehados: vacaciones.filter(v => v.estado === 'aprovechado').length,
    diasTotales: vacaciones.reduce((acc, v) => acc + v.dias, 0),
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Palmtree className="h-7 w-7 text-cyan-600" />
            Vacaciones
          </h1>
          <p className="text-gray-500">Gestión de vacaciones y permisos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="h-4 w-4 mr-2" /> Solicitar Vacaciones
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.pendientes}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Aprobados</p>
                <p className="text-3xl font-bold text-green-700">{stats.aprobados}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Aprovechados</p>
                <p className="text-3xl font-bold text-blue-700">{stats.aprovehados}</p>
              </div>
              <Palmtree className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-600 font-medium">Días Solicitados</p>
                <p className="text-3xl font-bold text-cyan-700">{stats.diasTotales}</p>
              </div>
              <Calendar className="h-10 w-10 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-cyan-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Solicitar Vacaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Empleado *</label>
                  <Input value={formData.empleado} onChange={(e) => setFormData({...formData, empleado: e.target.value})} required className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Área</label>
                  <Input value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Días Solicitados</label>
                  <Input type="number" value={formData.dias} onChange={(e) => setFormData({...formData, dias: Number(e.target.value)})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha Inicio</label>
                  <Input type="date" value={formData.fechaInicio} onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha Fin</label>
                  <Input type="date" value={formData.fechaFin} onChange={(e) => setFormData({...formData, fechaFin: e.target.value})} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Motivo</label>
                <Textarea value={formData.motivo} onChange={(e) => setFormData({...formData, motivo: e.target.value})} className="mt-1" rows={2} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">Enviar Solicitud</Button>
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
                <Input placeholder="Buscar..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todos los estados</option>
              {ESTADOS_VACACION.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Vacaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vacaciones.map((vac) => {
              const estado = ESTADOS_VACACION.find(e => e.value === vac.estado)
              const EstadoIcon = estado?.icon || Clock
              return (
                <div key={vac.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Palmtree className="h-6 w-6 text-cyan-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{vac.empleado}</span>
                          <span className="text-sm text-gray-500">{vac.area}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {vac.fechaInicio} al {vac.fechaFin}</span>
                          <span>•</span>
                          <span>{vac.dias} días</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${estado?.color}`}>
                        <EstadoIcon className="h-4 w-4" />
                        {estado?.label}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
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

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Calendar, Search, Plus, Edit, Trash2, User, CheckCircle, Clock, 
  AlertTriangle, Flag, Target
} from 'lucide-react'

const PRIORIDADES = [
  { value: 'baja', label: 'Baja', color: 'bg-green-100 text-green-700' },
  { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'alta', label: 'Alta', color: 'bg-red-100 text-red-700' },
]

const ESTADOS = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-gray-100 text-gray-700' },
  { value: 'en_progreso', label: 'En Progreso', color: 'bg-blue-100 text-blue-700' },
  { value: 'completada', label: 'Completada', color: 'bg-green-100 text-green-700' },
  { value: 'cancelada', label: 'Cancelada', color: 'bg-red-100 text-red-700' },
]

export default function TareasPage() {
  const [tareas, setTareas] = useState<any[]>([
    { id: 1, titulo: 'Elaborar presupuesto', proyecto: 'Obra Lima Centro', responsable: 'Juan Pérez', prioridad: 'alta', estado: 'en_progreso', fechaInicio: '2026-03-20', fechaFin: '2026-03-25', progreso: 60 },
    { id: 2, titulo: 'Revisar planos', proyecto: 'Supervisión Javier Prado', responsable: 'María García', prioridad: 'media', estado: 'pendiente', fechaInicio: '2026-03-22', fechaFin: '2026-03-28', progreso: 0 },
    { id: 3, titulo: 'Coordinar con proveedor', proyecto: 'Obra Lima Centro', responsable: 'Carlos López', prioridad: 'baja', estado: 'completada', fechaInicio: '2026-03-15', fechaFin: '2026-03-18', progreso: 100 },
  ])
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({
    titulo: '', proyecto: '', responsable: '', prioridad: 'media', fechaInicio: '', fechaFin: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo = { ...formData, id: Date.now(), estado: 'pendiente', progreso: 0 }
    setTareas([nuevo, ...tareas])
    setShowForm(false)
    setFormData({ titulo: '', proyecto: '', responsable: '', prioridad: 'media', fechaInicio: '', fechaFin: '' })
  }

  const tareasFiltradas = tareas.filter(t => 
    t.titulo.toLowerCase().includes(search.toLowerCase()) || 
    t.proyecto.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: tareas.length,
    pendientes: tareas.filter(t => t.estado === 'pendiente').length,
    enProgreso: tareas.filter(t => t.estado === 'en_progreso').length,
    completadas: tareas.filter(t => t.estado === 'completada').length,
  }

  const proyectos = [...new Set(tareas.map(t => t.proyecto))]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-7 w-7 text-blue-600" />
            Tareas
          </h1>
          <p className="text-gray-500">Gestión de tareas por proyecto</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Nueva Tarea
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Tareas</p>
                <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <Target className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pendientes</p>
                <p className="text-3xl font-bold text-gray-700">{stats.pendientes}</p>
              </div>
              <Clock className="h-10 w-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">En Progreso</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.enProgreso}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completadas</p>
                <p className="text-3xl font-bold text-green-700">{stats.completadas}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nueva Tarea
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Título *</label>
                  <Input value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} required className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Proyecto</label>
                  <Input value={formData.proyecto} onChange={(e) => setFormData({...formData, proyecto: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Responsable</label>
                  <Input value={formData.responsable} onChange={(e) => setFormData({...formData, responsable: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Prioridad</label>
                  <select value={formData.prioridad} onChange={(e) => setFormData({...formData, prioridad: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {PRIORIDADES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
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
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Crear Tarea</Button>
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
                <Input placeholder="Buscar tarea..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todos los estados</option>
              {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tareas */}
      <Card>
        <CardHeader>
          <CardTitle>Tareas ({tareasFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tareasFiltradas.map((tarea) => {
              const prioridad = PRIORIDADES.find(p => p.value === tarea.prioridad)
              const estado = ESTADOS.find(e => e.value === tarea.estado)
              return (
                <div key={tarea.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{tarea.titulo}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs ${prioridad?.color}`}>{prioridad?.label}</span>
                        </div>
                        <p className="text-sm text-gray-500">{tarea.proyecto}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {tarea.responsable}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {tarea.fechaInicio} - {tarea.fechaFin}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progreso</span>
                          <span>{tarea.progreso}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${tarea.progreso === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${tarea.progreso}%` }} />
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${estado?.color}`}>
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

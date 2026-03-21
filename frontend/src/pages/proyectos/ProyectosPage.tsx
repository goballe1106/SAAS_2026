import { useState } from 'react'
import { proyectosService } from '../../services/proyectos.service'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Folder, Search, Plus, Edit, Trash2, Calendar, DollarSign, Users, FileText } from 'lucide-react'

const ESTADOS = [
  { value: 'propuesta', label: 'Propuesta', color: 'bg-gray-100 text-gray-700' },
  { value: 'aprobado', label: 'Aprobado', color: 'bg-blue-100 text-blue-700' },
  { value: 'iniciado', label: 'Iniciado', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'en_progreso', label: 'En Progreso', color: 'bg-orange-100 text-orange-700' },
  { value: 'en_revision', label: 'En Revisión', color: 'bg-purple-100 text-purple-700' },
  { value: 'cerrado', label: 'Cerrado', color: 'bg-green-100 text-green-700' },
  { value: 'pausado', label: 'Pausado', color: 'bg-red-100 text-red-700' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-200 text-red-800' },
]

const PRIORIDADES = [
  { value: 'baja', label: 'Baja', color: 'bg-gray-100 text-gray-700' },
  { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-700' },
  { value: 'critica', label: 'Crítica', color: 'bg-red-100 text-red-700' },
]

const TIPOS = [
  'Obra Civil', 'Supervisión', 'Consultoría', 'Diseño', 'Proyecto Integral', 'Mantenimiento', 'Otro'
]

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '', codigo: '', descripcion: '', tipo: '', estado: 'propuesta', prioridad: 'media',
    presupuesto: 0, fechaInicio: '', fechaFin: '', areaId: '', responsableId: '',
    clienteId: '', notas: ''
  })

  const loadProyectos = async () => {
    setLoading(true)
    try {
      const response = await proyectosService.getAll({ search })
      setProyectos(response.data || [])
    } catch (error) {
      console.error('Error loading proyectos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await proyectosService.create(formData)
      setShowForm(false)
      setFormData({
        nombre: '', codigo: '', descripcion: '', tipo: '', estado: 'propuesta', prioridad: 'media',
        presupuesto: 0, fechaInicio: '', fechaFin: '', areaId: '', responsableId: '',
        clienteId: '', notas: ''
      })
      loadProyectos()
    } catch (error) {
      console.error('Error creating proyecto:', error)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-500">Gestión de proyectos y obras</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {showForm && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="text-blue-900">Nuevo Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos principales */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Folder className="h-4 w-4" /> Datos del Proyecto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre del Proyecto *</label>
                    <Input value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} required className="mt-1" placeholder="Obra de construcción" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Código</label>
                    <Input value={formData.codigo} onChange={(e) => handleChange('codigo', e.target.value)} className="mt-1" placeholder="PROY-2026-001" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tipo de Proyecto</label>
                    <select value={formData.tipo} onChange={(e) => handleChange('tipo', e.target.value)} className="w-full mt-1 p-2 border rounded-md">
                      <option value="">Seleccionar...</option>
                      {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                    <select value={formData.estado} onChange={(e) => handleChange('estado', e.target.value)} className="w-full mt-1 p-2 border rounded-md">
                      {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Prioridad</label>
                    <select value={formData.prioridad} onChange={(e) => handleChange('prioridad', e.target.value)} className="w-full mt-1 p-2 border rounded-md">
                      {PRIORIDADES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Presupuesto (S/)</label>
                    <Input type="number" value={formData.presupuesto} onChange={(e) => handleChange('presupuesto', parseFloat(e.target.value))} className="mt-1" placeholder="0.00" />
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Fechas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fecha de Inicio</label>
                    <Input type="date" value={formData.fechaInicio} onChange={(e) => handleChange('fechaInicio', e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fecha de Fin Prevista</label>
                    <Input type="date" value={formData.fechaFin} onChange={(e) => handleChange('fechaFin', e.target.value)} className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea value={formData.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} className="w-full mt-1 p-2 border rounded-md" rows={3} placeholder="Descripción detallada del proyecto..." />
              </div>

              {/* Notas */}
              <div>
                <label className="text-sm font-medium text-gray-700">Notas</label>
                <textarea value={formData.notas} onChange={(e) => handleChange('notas', e.target.value)} className="w-full mt-1 p-2 border rounded-md" rows={2} placeholder="Observaciones adicionales..." />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Guardar Proyecto</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Buscador */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar proyectos..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary" onClick={loadProyectos}>Buscar</Button>
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Proyectos ({proyectos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Cargando...</p> : proyectos.length === 0 ? (
            <p className="text-gray-500">No hay proyectos. Crea el primero.</p>
          ) : (
            <div className="space-y-2">
              {proyectos.map((proyecto) => (
                <div key={proyecto.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Folder className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{proyecto.nombre}</p>
                      <p className="text-sm text-gray-500">{proyecto.codigo}</p>
                      <div className="flex gap-2 mt-1">
                        {proyecto.fechaInicio && <span className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-1"><Calendar className="h-3 w-3" /> {proyecto.fechaInicio}</span>}
                        {proyecto.presupuesto && <span className="text-xs bg-green-100 px-2 py-1 rounded flex items-center gap-1"><DollarSign className="h-3 w-3" /> S/{proyecto.presupuesto.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${ESTADOS.find(e => e.value === proyecto.estado)?.color || 'bg-gray-100'}`}>
                      {ESTADOS.find(e => e.value === proyecto.estado)?.label || proyecto.estado}
                    </span>
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

import { useState } from 'react'
import { proyectosService } from '../../services/proyectos.service'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Folder, Search, Plus, Edit, Trash2 } from 'lucide-react'

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', codigo: '', descripcion: '', estado: 'propuesta' })

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
      setFormData({ nombre: '', codigo: '', descripcion: '', estado: 'propuesta' })
      loadProyectos()
    } catch (error) {
      console.error('Error creating proyecto:', error)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nombre *</label>
                  <Input value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
                </div>
                <div>
                  <label className="text-sm font-medium">Código</label>
                  <Input value={formData.codigo} onChange={(e) => setFormData({...formData, codigo: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Descripción</label>
                <Input value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Guardar</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar proyectos..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary" onClick={loadProyectos}>Buscar</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Proyectos ({proyectos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Cargando...</p> : proyectos.length === 0 ? (
            <p className="text-gray-500">No hay proyectos. Crea el primero.</p>
          ) : (
            <div className="space-y-2">
              {proyectos.map((proyecto) => (
                <div key={proyecto.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{proyecto.nombre}</p>
                      <p className="text-sm text-gray-500">{proyecto.codigo}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
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

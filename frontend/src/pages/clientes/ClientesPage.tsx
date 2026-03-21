import { useState } from 'react'
import { clientesService } from '../../services/clientes.service'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Building2, Search, Plus, Edit, Trash2 } from 'lucide-react'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ razonSocial: '', ruc: '', email: '', telefono: '', direccion: '' })

  const loadClientes = async () => {
    setLoading(true)
    try {
      const response = await clientesService.getAll({ search })
      setClientes(response.data || [])
    } catch (error) {
      console.error('Error loading clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await clientesService.create(formData)
      setShowForm(false)
      setFormData({ razonSocial: '', ruc: '', email: '', telefono: '', direccion: '' })
      loadClientes()
    } catch (error) {
      console.error('Error creating cliente:', error)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Razón Social *</label>
                  <Input value={formData.razonSocial} onChange={(e) => setFormData({...formData, razonSocial: e.target.value})} required />
                </div>
                <div>
                  <label className="text-sm font-medium">RUC</label>
                  <Input value={formData.ruc} onChange={(e) => setFormData({...formData, ruc: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Dirección</label>
                <Input value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} />
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
          <Input placeholder="Buscar clientes..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary" onClick={loadClientes}>Buscar</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes ({clientes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Cargando...</p> : clientes.length === 0 ? (
            <p className="text-gray-500">No hay clientes. Crea el primero.</p>
          ) : (
            <div className="space-y-2">
              {clientes.map((cliente) => (
                <div key={cliente.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{cliente.razonSocial}</p>
                      <p className="text-sm text-gray-500">{cliente.email}</p>
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

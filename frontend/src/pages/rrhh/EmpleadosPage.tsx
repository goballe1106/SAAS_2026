import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, Plus, Edit, Trash2, Mail, Phone, Calendar, MapPin } from 'lucide-react'

const ESTADOS = ['activo', 'inactivo', 'vacaciones', 'licencia', 'contrato']

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', dni: '', email: '', telefono: '',
    direccion: '', cargo: '', areaId: '', fechaIngreso: '', estado: 'activo'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setFormData({ nombres: '', apellidos: '', dni: '', email: '', telefono: '', direccion: '', cargo: '', areaId: '', fechaIngreso: '', estado: 'activo' })
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empleados</h1>
          <p className="text-gray-500">Gestión de personal y recursos humanos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Empleado
        </Button>
      </div>

      {showForm && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle>Nuevo Empleado</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Nombres *</label>
                  <Input value={formData.nombres} onChange={(e) => setFormData({...formData, nombres: e.target.value})} required className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Apellidos *</label>
                  <Input value={formData.apellidos} onChange={(e) => setFormData({...formData, apellidos: e.target.value})} required className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">DNI</label>
                  <Input value={formData.dni} onChange={(e) => setFormData({...formData, dni: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Cargo</label>
                  <Input value={formData.cargo} onChange={(e) => setFormData({...formData, cargo: e.target.value})} className="mt-1" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600">Guardar</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar empleado..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary">Buscar</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Empleados ({empleados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {empleados.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay empleados registrados</p>
          ) : (
            <div className="space-y-2">
              {empleados.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{emp.nombres} {emp.apellidos}</p>
                      <p className="text-sm text-gray-500">{emp.cargo} • {emp.area}</p>
                      <div className="flex gap-2 mt-1">
                        {emp.email && <span className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-1"><Mail className="h-3 w-3" /> {emp.email}</span>}
                        <span className={`text-xs px-2 py-1 rounded ${emp.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{emp.estado}</span>
                      </div>
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

import { useState } from 'react'
import { clientesService } from '../../services/clientes.service'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Building2, Search, Plus, Edit, Trash2, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react'

const ESTADOS = [
  { value: 'prospecto', label: 'Prospecto' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'potencial', label: 'Potencial' },
]

const SECTORES = [
  'Construcción', 'Retail', 'Servicios', 'Industrial', 'Tecnología', 'Salud', 'Educación', 'Transporte', 'Otro'
]

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    razonSocial: '', ruc: '', nombreComercial: '', email: '', telefono: '', whatsapp: '',
    direccion: '', ciudad: '', pais: '', web: '', sector: '', actividad: '',
    contactoNombre: '', contactoTelefono: '', contactoEmail: '',
    estado: 'prospecto', limiteCredito: 0, notas: ''
  })

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
      setFormData({ razonSocial: '', ruc: '', nombreComercial: '', email: '', telefono: '', whatsapp: '', direccion: '', ciudad: '', pais: '', web: '', sector: '', actividad: '', contactoNombre: '', contactoTelefono: '', contactoEmail: '', estado: 'prospecto', limiteCredito: 0, notas: '' })
      loadClientes()
    } catch (error) {
      console.error('Error creating cliente:', error)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500">Gestión de clientes y contactos comerciales</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {showForm && (
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-50 border-b">
            <CardTitle className="text-blue-900">Nuevo Cliente</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos principales */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Datos Principales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Razón Social *</label>
                    <Input value={formData.razonSocial} onChange={(e) => handleChange('razonSocial', e.target.value)} required className="mt-1" placeholder="Empresa SAC" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre Comercial</label>
                    <Input value={formData.nombreComercial} onChange={(e) => handleChange('nombreComercial', e.target.value)} className="mt-1" placeholder="Nombre de fantasía" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">RUC / Documento</label>
                    <Input value={formData.ruc} onChange={(e) => handleChange('ruc', e.target.value)} className="mt-1" placeholder="20123456789" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                    <select value={formData.estado} onChange={(e) => handleChange('estado', e.target.value)} className="w-full mt-1 p-2 border rounded-md">
                      {ESTADOS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Sector</label>
                    <select value={formData.sector} onChange={(e) => handleChange('sector', e.target.value)} className="w-full mt-1 p-2 border rounded-md">
                      <option value="">Seleccionar...</option>
                      {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Actividad</label>
                    <Input value={formData.actividad} onChange={(e) => handleChange('actividad', e.target.value)} className="mt-1" placeholder="Construcción de obras" />
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="mt-1" placeholder="contacto@empresa.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <Input value={formData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} className="mt-1" placeholder="+51 123 456 789" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">WhatsApp</label>
                    <Input value={formData.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)} className="mt-1" placeholder="+51 999 999 999" />
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Dirección
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Dirección</label>
                    <Input value={formData.direccion} onChange={(e) => handleChange('direccion', e.target.value)} className="mt-1" placeholder="Av. Principal 123" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Ciudad</label>
                    <Input value={formData.ciudad} onChange={(e) => handleChange('ciudad', e.target.value)} className="mt-1" placeholder="Lima" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">País</label>
                    <Input value={formData.pais} onChange={(e) => handleChange('pais', e.target.value)} className="mt-1" placeholder="Perú" />
                  </div>
                </div>
              </div>

              {/* Contacto de referencia */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Contacto de Referencia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre Contacto</label>
                    <Input value={formData.contactoNombre} onChange={(e) => handleChange('contactoNombre', e.target.value)} className="mt-1" placeholder="Juan Pérez" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Teléfono Contacto</label>
                    <Input value={formData.contactoTelefono} onChange={(e) => handleChange('contactoTelefono', e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Contacto</label>
                    <Input type="email" value={formData.contactoEmail} onChange={(e) => handleChange('contactoEmail', e.target.value)} className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="text-sm font-medium text-gray-700">Notas</label>
                <textarea value={formData.notas} onChange={(e) => handleChange('notas', e.target.value)} className="w-full mt-1 p-2 border rounded-md" rows={3} placeholder="Observaciones adicionales..." />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Guardar Cliente</Button>
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
          <Input placeholder="Buscar por nombre, RUC o email..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="secondary" onClick={loadClientes}>Buscar</Button>
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes ({clientes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Cargando...</p> : clientes.length === 0 ? (
            <p className="text-gray-500">No hay clientes. Crea el primero.</p>
          ) : (
            <div className="space-y-2">
              {clientes.map((cliente) => (
                <div key={cliente.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cliente.razonSocial}</p>
                      <p className="text-sm text-gray-500">{cliente.ruc} • {cliente.email}</p>
                      <div className="flex gap-2 mt-1">
                        {cliente.telefono && <span className="text-xs bg-gray-100 px-2 py-1 rounded">{cliente.telefono}</span>}
                        <span className={`text-xs px-2 py-1 rounded ${cliente.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{cliente.estado}</span>
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

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Clock, Search, Plus, Edit, Trash2, Calendar, User, CheckCircle, 
  XCircle, AlertTriangle, Fingerprint, MapPin
} from 'lucide-react'

const ESTADOS_ASISTENCIA = [
  { value: 'presente', label: 'Presente', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'falta', label: 'Falta', color: 'bg-red-100 text-red-700', icon: XCircle },
  { value: 'tardanza', label: 'Tardanza', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'permiso', label: 'Permiso', color: 'bg-blue-100 text-blue-700', icon: Calendar },
  { value: 'vacaciones', label: 'Vacaciones', color: 'bg-purple-100 text-purple-700', icon: Calendar },
]

export default function AsistenciaPage() {
  const [asistencias, setAsistencias] = useState<any[]>([
    { id: 1, empleado: 'Juan Pérez', dni: '12345678', area: 'Operaciones', horaEntrada: '08:00', horaSalida: '17:00', estado: 'presente', fecha: '2026-03-21' },
    { id: 2, empleado: 'María García', dni: '87654321', area: 'Contabilidad', horaEntrada: '08:15', horaSalida: '17:00', estado: 'tardanza', fecha: '2026-03-21' },
    { id: 3, empleado: 'Carlos López', dni: '11223344', area: 'TI', horaEntrada: '-', horaSalida: '-', estado: 'falta', fecha: '2026-03-21' },
    { id: 4, empleado: 'Ana Martínez', dni: '55667788', area: 'RRHH', horaEntrada: '08:00', horaSalida: '17:00', estado: 'presente', fecha: '2026-03-21' },
    { id: 5, empleado: 'Roberto Sánchez', dni: '99887766', area: 'Logística', horaEntrada: '-', horaSalida: '-', estado: 'permiso', fecha: '2026-03-21' },
  ])
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({
    empleado: '', dni: '', area: '', fecha: '', horaEntrada: '', horaSalida: '', estado: 'presente', observaciones: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo = { ...formData, id: Date.now() }
    setAsistencias([nuevo, ...asistencias])
    setShowForm(false)
    setFormData({ empleado: '', dni: '', area: '', fecha: '', horaEntrada: '', horaSalida: '', estado: 'presente', observaciones: '' })
  }

  const stats = {
    presentes: asistencias.filter((a: any) => a.estado === 'presente').length,
    faltas: asistencias.filter((a: any) => a.estado === 'falta').length,
    tardanzas: asistencias.filter((a: any) => a.estado === 'tardanza').length,
    permisos: asistencias.filter((a: any) => a.estado === 'permiso').length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="h-7 w-7 text-blue-600" />
            Asistencia
          </h1>
          <p className="text-gray-500">Control de asistencia y puntualidad</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Registrar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Presentes</p>
                <p className="text-3xl font-bold text-green-700">{stats.presentes}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Faltas</p>
                <p className="text-3xl font-bold text-red-700">{stats.faltas}</p>
              </div>
              <XCircle className="h-10 w-10 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Tardanzas</p>
                <p className="text-3xl font-bold text-yellow-700">{stats.tardanzas}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Permisos</p>
                <p className="text-3xl font-bold text-blue-700">{stats.permisos}</p>
              </div>
              <Calendar className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de asistencia de hoy */}
      <Card>
        <CardHeader>
          <CardTitle>Asistencia Hoy - 21/03/2026</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Empleado</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">DNI</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Área</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Entrada</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Salida</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Estado</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map((asis) => {
                  const estado = ESTADOS_ASISTENCIA.find(e => e.value === asis.estado)
                  const EstadoIcon = estado?.icon || Clock
                  return (
                    <tr key={asis.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{asis.empleado}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{asis.dni}</td>
                      <td className="p-3 text-gray-600">{asis.area}</td>
                      <td className="p-3">{asis.horaEntrada}</td>
                      <td className="p-3">{asis.horaSalida}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${estado?.color}`}>
                          <EstadoIcon className="h-3 w-3" />
                          {estado?.label}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
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

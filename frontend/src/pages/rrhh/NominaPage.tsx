import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  DollarSign, Search, Plus, Edit, Trash2, User, Calendar, TrendingUp, 
  TrendingDown, FileText, Download
} from 'lucide-react'

export default function NominaPage() {
  const [empleados, setEmpleados] = useState<any[]>([
    { id: 1, nombre: 'Juan Pérez', dni: '12345678', area: 'Operaciones', cargo: 'Supervisor', basico: 3500, horasExtra: 200, bonificaciones: 300, descuentos: 150, neto: 3850, periodo: 'Marzo 2026' },
    { id: 2, nombre: 'María García', dni: '87654321', area: 'Contabilidad', cargo: 'Contadora', basico: 4000, horasExtra: 0, bonificaciones: 500, descuentos: 200, neto: 4300, periodo: 'Marzo 2026' },
    { id: 3, nombre: 'Carlos López', dni: '11223344', area: 'TI', cargo: 'Analista', basico: 3800, horasExtra: 150, bonificaciones: 200, descuento: 120, neto: 4030, periodo: 'Marzo 2026' },
    { id: 4, nombre: 'Ana Martínez', dni: '55667788', area: 'RRHH', cargo: 'Analista RRHH', basico: 3200, horasExtra: 0, bonificaciones: 150, descuentos: 100, neto: 3250, periodo: 'Marzo 2026' },
    { id: 5, nombre: 'Roberto Sánchez', dni: '99887766', area: 'Logística', cargo: 'Coordinador', basico: 3600, horasExtra: 300, bonificaciones: 200, descuentos: 180, neto: 3920, periodo: 'Marzo 2026' },
  ])
  const [search, setSearch] = useState('')
  const [periodo, setPeriodo] = useState('Marzo 2026')

  const stats = {
    total: empleados.reduce((acc, e) => acc + e.neto, 0),
    promedio: empleados.reduce((acc, e) => acc + e.neto, 0) / empleados.length,
    totalHorasExtra: empleados.reduce((acc, e) => acc + e.horasExtra, 0),
    empleados: empleados.length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-7 w-7 text-green-600" />
            Nómina
          </h1>
          <p className="text-gray-500">Planilla de empleados</p>
        </div>
        <div className="flex gap-2">
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="p-2 border rounded-md bg-white">
            <option>Marzo 2026</option>
            <option>Febrero 2026</option>
            <option>Enero 2026</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" /> Generar Planilla
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Nómina</p>
                <p className="text-2xl font-bold text-green-700">S/ {stats.total.toLocaleString()}</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Empleados</p>
                <p className="text-3xl font-bold text-blue-700">{stats.empleados}</p>
              </div>
              <User className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Salario Promedio</p>
                <p className="text-2xl font-bold text-purple-700">S/ {Math.round(stats.promedio).toLocaleString()}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Horas Extra</p>
                <p className="text-2xl font-bold text-yellow-700">S/ {stats.totalHorasExtra.toLocaleString()}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar empleado..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de nómina */}
      <Card>
        <CardHeader>
          <CardTitle>Planilla de {periodo}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Empleado</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">DNI</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Área</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Básico</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">H. Extra</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Bonif.</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Desc.</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Neto</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{emp.nombre}</p>
                          <p className="text-xs text-gray-500">{emp.cargo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{emp.dni}</td>
                    <td className="p-3 text-gray-600">{emp.area}</td>
                    <td className="p-3 text-right">S/ {emp.basico.toLocaleString()}</td>
                    <td className="p-3 text-right">S/ {emp.horasExtra.toLocaleString()}</td>
                    <td className="p-3 text-right text-green-600">+S/ {emp.bonificaciones.toLocaleString()}</td>
                    <td className="p-3 text-right text-red-600">-S/ {emp.descuentos.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-green-700">S/ {emp.neto.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon"><FileText className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={3} className="p-3 text-right">TOTALES:</td>
                  <td className="p-3 text-right">S/ {empleados.reduce((acc, e) => acc + e.basico, 0).toLocaleString()}</td>
                  <td className="p-3 text-right">S/ {empleados.reduce((acc, e) => acc + e.horasExtra, 0).toLocaleString()}</td>
                  <td className="p-3 text-right">S/ {empleados.reduce((acc, e) => acc + e.bonificaciones, 0).toLocaleString()}</td>
                  <td className="p-3 text-right">S/ {empleados.reduce((acc, e) => acc + (e.descuentos || 0), 0).toLocaleString()}</td>
                  <td className="p-3 text-right text-green-700">S/ {empleados.reduce((acc, e) => acc + e.neto, 0).toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

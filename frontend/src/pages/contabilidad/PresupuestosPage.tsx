import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Calculator, Search, Plus, Edit, Trash2, DollarSign, TrendingUp, TrendingDown,
  PieChart, BarChart3, FileText, CheckCircle
} from 'lucide-react'

const PARTIDAS = [
  { codigo: '2.1', nombre: 'Gastos de Personal', presupuesto: 120000, real: 115000 },
  { codigo: '2.2', nombre: 'Materiales y Suministros', presupuesto: 80000, real: 72000 },
  { codigo: '2.3', nombre: 'Servicios', presupuesto: 50000, real: 48000 },
  { codigo: '2.4', nombre: 'Gastos de Capital', presupuesto: 30000, real: 28000 },
  { codigo: '2.5', nombre: 'Otros Gastos', presupuesto: 20000, real: 18000 },
]

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState<any[]>([
    { id: 1, nombre: 'Presupuesto 2026 - Obra Lima Centro', tipo: 'Obra', total: 300000, ejecutando: 135000, estado: 'aprobado', año: 2026 },
    { id: 2, nombre: 'Presupuesto 2026 - Supervisión Javier Prado', tipo: 'Supervisión', total: 150000, ejecutando: 45000, estado: 'aprobado', año: 2026 },
    { id: 3, nombre: 'Presupuesto 2026 - Gastos Operativos', tipo: 'Operativo', total: 200000, ejecutando: 95000, estado: 'pendiente', año: 2026 },
  ])
  const [search, setSearch] = useState('')
  const [showDetalle, setShowDetalle] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({
    nombre: '', tipo: 'Obra', año: 2026, total: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo = { ...formData, id: Date.now(), ejecutando: 0, estado: 'pendiente' }
    setPresupuestos([nuevo, ...presupuestos])
    setShowForm(false)
  }

  const presupuestosFiltrados = presupuestos.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const totalPresupuestado = presupuestos.reduce((acc, p) => acc + p.total, 0)
  const totalEjecutado = presupuestos.reduce((acc, p) => acc + p.ejecutando, 0)
  const promedioEjecucion = totalPresupuestado > 0 ? (totalEjecutado / totalPresupuestado) * 100 : 0

  const totalPartidas = PARTIDAS.reduce((acc, p) => acc + p.presupuesto, 0)
  const totalReal = PARTIDAS.reduce((acc, p) => acc + p.real, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="h-7 w-7 text-indigo-600" />
            Presupuestos
          </h1>
          <p className="text-gray-500">Gestión de presupuestos y seguimiento</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" /> Nuevo Presupuesto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-600 font-medium">Total Presupuestado</p>
                <p className="text-2xl font-bold text-indigo-700">S/ {totalPresupuestado.toLocaleString()}</p>
              </div>
              <Calculator className="h-10 w-10 text-indigo-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Ejecutado</p>
                <p className="text-2xl font-bold text-blue-700">S/ {totalEjecutado.toLocaleString()}</p>
              </div>
              <DollarSign className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">% Ejecución</p>
                <p className="text-2xl font-bold text-green-700">{promedioEjecucion.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Presupuestos</p>
                <p className="text-3xl font-bold text-purple-700">{presupuestos.length}</p>
              </div>
              <FileText className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-indigo-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Presupuesto
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre *</label>
                  <Input value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    <option value="Obra">Obra</option>
                    <option value="Supervisión">Supervisión</option>
                    <option value="Operativo">Operativo</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Año</label>
                  <Input type="number" value={formData.año} onChange={(e) => setFormData({...formData, año: Number(e.target.value)})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Monto Total (S/)</label>
                  <Input type="number" value={formData.total} onChange={(e) => setFormData({...formData, total: Number(e.target.value)})} className="mt-1" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Crear</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Detalle de presupuesto */}
      {showDetalle && (
        <Card className="border-indigo-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Detalle: {showDetalle.nombre}</CardTitle>
              <Button variant="ghost" onClick={() => setShowDetalle(null)}>Cerrar</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Partida</th>
                    <th className="text-left p-3 text-sm font-medium text-gray-600">Descripción</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-600">Presupuesto</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-600">Real</th>
                    <th className="text-right p-3 text-sm font-medium text-gray-600">Variación</th>
                  </tr>
                </thead>
                <tbody>
                  {PARTIDAS.map((partida) => {
                    const variacion = partida.presupuesto - partida.real
                    const pct = (variacion / partida.presupuesto) * 100
                    return (
                      <tr key={partida.codigo} className="border-b">
                        <td className="p-3 font-medium">{partida.codigo}</td>
                        <td className="p-3">{partida.nombre}</td>
                        <td className="p-3 text-right">S/ {partida.presupuesto.toLocaleString()}</td>
                        <td className="p-3 text-right">S/ {partida.real.toLocaleString()}</td>
                        <td className={`p-3 text-right font-medium ${variacion > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {variacion > 0 ? <TrendingDown className="inline h-4 w-4" /> : <TrendingUp className="inline h-4 w-4" />}
                          {' '}S/ {variacion.toLocaleString()} ({pct.toFixed(1)}%)
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={2} className="p-3 text-right">TOTAL:</td>
                    <td className="p-3 text-right">S/ {totalPartidas.toLocaleString()}</td>
                    <td className="p-3 text-right">S/ {totalReal.toLocaleString()}</td>
                    <td className={`p-3 text-right ${totalPartidas - totalReal > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      S/ {(totalPartidas - totalReal).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar presupuesto..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Presupuestos ({presupuestosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {presupuestosFiltrados.map((pres) => {
              const pct = pres.total > 0 ? (pres.ejecutando / pres.total) * 100 : 0
              return (
                <div key={pres.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Calculator className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{pres.nombre}</h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span>{pres.tipo}</span>
                          <span>•</span>
                          <span>{pres.año}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${pres.estado === 'aprobado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {pres.estado}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">S/ {pres.total.toLocaleString()}</p>
                      <div className="w-32 mt-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Ejecutado</span>
                          <span>{pct.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct > 100 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button variant="outline" size="sm" onClick={() => setShowDetalle(pres)}>
                        Ver Detalle
                      </Button>
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

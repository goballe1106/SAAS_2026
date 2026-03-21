import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Monitor, Server, Laptop, Wifi, AlertTriangle, CheckCircle, Clock, TrendingUp,
  TrendingDown, Users, Package, Wrench, DollarSign, Calendar
} from 'lucide-react'

// Componente de KPI
function KPICard({ title, value, subtitle, icon: Icon, trend, trendUp, color }: any) {
  return (
    <Card className={`bg-gradient-to-br ${color}`}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80 font-medium">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
          </div>
          <div className="h-12 w-12 bg-white/30 rounded-full flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trendUp ? 'text-green-700' : 'text-red-700'}`}>
            {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente de gráfico simple
function MiniChart({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 ${color} rounded-t`}
          style={{ height: `${((v - min) / range) * 100}%`, minHeight: '4px' }}
        />
      ))}
    </div>
  )
}

export default function KPIsTIPage() {
  const [periodo, setPeriodo] = useState('mes')

  // KPIs principales
  const kpis = {
    totalActivos: 145,
    activosCriticos: 12,
    disponibilidad: 98.5,
    ticketsAbiertos: 23,
    ticketsResueltos: 156,
    costoPromedio: 1250,
    tiempoRespuesta: 2.4,
    satisfaccion: 4.2,
  }

  // Datos para gráficos
  const ticketsData = [12, 19, 15, 25, 22, 30, 28]
  const activosData = [120, 125, 130, 135, 140, 142, 145]
  const costoData = [1100, 1150, 1200, 1180, 1220, 1240, 1250]

  // Activos por categoría
  const activosPorCategoria = [
    { cat: 'Computadoras', cant: 45, icon: Monitor },
    { cat: 'Laptops', cant: 38, icon: Laptop },
    { cat: 'Servidores', cant: 8, icon: Server },
    { cat: 'Red', cant: 22, icon: Wifi },
    { cat: 'Impresoras', cant: 15, icon: Package },
    { cat: 'Otros', cant: 17, icon: Monitor },
  ]

  // Tickets por categoría
  const ticketsPorCategoria = [
    { cat: 'Soporte', cant: 45, color: 'bg-blue-500' },
    { cat: 'Hardware', cant: 28, color: 'bg-red-500' },
    { cat: 'Software', cant: 35, color: 'bg-purple-500' },
    { cat: 'Red', cant: 15, color: 'bg-yellow-500' },
    { cat: 'Acceso', cant: 22, color: 'bg-green-500' },
  ]

  // Activos con problemas
  const activosConProblemas = [
    { codigo: 'TI-012', descripcion: 'Dell Optiplex 7080', problema: 'Disco duro fallando', prioridad: 'alta', dias: 5 },
    { codigo: 'TI-034', descripcion: 'Laptop HP ProBook', problema: 'Batería defectuosa', prioridad: 'media', dias: 12 },
    { codigo: 'TI-056', descripcion: 'Switch Cisco 2960', problema: 'Puerto dañado', prioridad: 'alta', dias: 3 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-indigo-600" />
            KPIs TI
          </h1>
          <p className="text-gray-500">Métricas e indicadores de Tecnología</p>
        </div>
        <div className="flex gap-2">
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="p-2 border rounded-md bg-white">
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="trimestre">Este trimestre</option>
            <option value="año">Este año</option>
          </select>
          <Button variant="outline">Exportar</Button>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Activos" 
          value={kpis.totalActivos} 
          subtitle="+5 este mes"
          icon={Monitor} 
          color="from-blue-50 to-blue-100 border-blue-200"
          trend="+3.5%" 
          trendUp={true}
        />
        <KPICard 
          title="Disponibilidad" 
          value={`${kpis.disponibilidad}%`} 
          subtitle="Meta: 99%"
          icon={CheckCircle} 
          color="from-green-50 to-green-100 border-green-200"
          trend="-0.2%" 
          trendUp={false}
        />
        <KPICard 
          title="Tickets Abiertos" 
          value={kpis.ticketsAbiertos} 
          subtitle="12 críticos"
          icon={AlertTriangle} 
          color="from-red-50 to-red-100 border-red-200"
          trend="-15%" 
          trendUp={true}
        />
        <KPICard 
          title="Tiempo Respuesta" 
          value={`${kpis.tiempoRespuesta}h`} 
          subtitle="Promedio"
          icon={Clock} 
          color="from-yellow-50 to-yellow-100 border-yellow-200"
          trend="-8%" 
          trendUp={true}
        />
      </div>

      {/* Segunda fila - Más KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Tickets Resueltos" 
          value={kpis.ticketsResueltos} 
          subtitle="Este mes"
          icon={CheckCircle} 
          color="from-purple-50 to-purple-100 border-purple-200"
          trend="+22%" 
          trendUp={true}
        />
        <KPICard 
          title="Costo Promedio" 
          value={`S/ ${kpis.costoPromedio}`} 
          subtitle="Por activo"
          icon={DollarSign} 
          color="from-indigo-50 to-indigo-100 border-indigo-200"
          trend="+2%" 
          trendUp={false}
        />
        <KPICard 
          title="Satisfacción" 
          value={`${kpis.satisfaccion}/5`} 
          subtitle="Promedio"
          icon={Users} 
          color="from-pink-50 to-pink-100 border-pink-200"
          trend="+0.3" 
          trendUp={true}
        />
        <KPICard 
          title="Activos Críticos" 
          value={kpis.activosCriticos} 
          subtitle="Requieren atención"
          icon={AlertTriangle} 
          color="from-orange-50 to-orange-100 border-orange-200"
          trend="-2" 
          trendUp={true}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tickets últimos 7 días */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tickets última semana</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniChart data={ticketsData} color="bg-indigo-500" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Mín: {Math.min(...ticketsData)}</span>
              <span>Máx: {Math.max(...ticketsData)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Activos crecimiento */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Crecimiento de activos</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniChart data={activosData} color="bg-blue-500" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Mín: {Math.min(...activosData)}</span>
              <span>Máx: {Math.max(...activosData)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Costo promedio */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Costo promedio (S/)</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniChart data={costoData} color="bg-green-500" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Mín: S/ {Math.min(...costoData)}</span>
              <span>Máx: S/ {Math.max(...costoData)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activos por categoría y Tickets por categoría */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activos por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Activos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activosPorCategoria.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{item.cat}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(item.cant / 50) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{item.cant}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tickets por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ticketsPorCategoria.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{item.cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.cant / 50) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{item.cant}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activos con problemas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Activos con Problemas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Código</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Equipo</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Problema</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Prioridad</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Días Activo</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {activosConProblemas.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-3 font-medium text-blue-600">{item.codigo}</td>
                    <td className="p-3">{item.descripcion}</td>
                    <td className="p-3 text-gray-600">{item.problema}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.prioridad === 'alta' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.prioridad}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{item.dias}</td>
                    <td className="p-3 text-right">
                      <Button variant="outline" size="sm">
                        <Wrench className="h-3 w-3 mr-1" /> Programar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

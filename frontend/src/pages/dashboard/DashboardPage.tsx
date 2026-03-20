import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Users, Building2, Shield, Activity, TrendingUp, TrendingDown, Calendar, Clock, DollarSign, FileText } from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getStats,
  })

  const stats = data?.data?.stats
  const recentActivity = data?.data?.recentActivity || []

  // Mock data for charts - in real app this would come from API
  const monthlyData = [
    { month: 'Ene', usuarios: 65, areas: 28, proyectos: 45 },
    { month: 'Feb', usuarios: 72, areas: 32, proyectos: 52 },
    { month: 'Mar', usuarios: 78, areas: 35, proyectos: 61 },
    { month: 'Abr', usuarios: 85, areas: 38, proyectos: 58 },
    { month: 'May', usuarios: 92, areas: 42, proyectos: 70 },
    { month: 'Jun', usuarios: 98, areas: 45, proyectos: 75 },
  ]

  const activityByModule = [
    { name: 'Usuarios', value: 35, color: '#0088FE' },
    { name: 'Áreas', value: 25, color: '#00C49F' },
    { name: 'Roles', value: 20, color: '#FFBB28' },
    { name: 'Sistema', value: 20, color: '#FF8042' },
  ]

  const performanceData = [
    { time: '00:00', cpu: 30, memory: 45, requests: 120 },
    { time: '04:00', cpu: 25, memory: 40, requests: 80 },
    { time: '08:00', cpu: 65, memory: 70, requests: 280 },
    { time: '12:00', cpu: 80, memory: 85, requests: 350 },
    { time: '16:00', cpu: 70, memory: 75, requests: 320 },
    { time: '20:00', cpu: 45, memory: 55, requests: 180 },
  ]

  const cards = [
    { 
      title: 'Usuarios', 
      value: stats?.totalUsuarios ?? '-', 
      icon: Users, 
      color: 'text-blue-600 bg-blue-100',
      change: '+12%',
      changeType: 'increase'
    },
    { 
      title: 'Áreas', 
      value: stats?.totalAreas ?? '-', 
      icon: Building2, 
      color: 'text-green-600 bg-green-100',
      change: '+8%',
      changeType: 'increase'
    },
    { 
      title: 'Roles', 
      value: stats?.totalRoles ?? '-', 
      icon: Shield, 
      color: 'text-purple-600 bg-purple-100',
      change: '+5%',
      changeType: 'increase'
    },
    { 
      title: 'Actividad', 
      value: recentActivity.length ?? '-', 
      icon: Activity, 
      color: 'text-orange-600 bg-orange-100',
      change: '+18%',
      changeType: 'increase'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Resumen general del sistema ERP SAS</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : card.value}
                </div>
                <div className={`flex items-center text-xs ${
                  card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.changeType === 'increase' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {card.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Trends */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendencias Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="usuarios" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  dot={{ fill: '#0088FE' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="areas" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  dot={{ fill: '#00C49F' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="proyectos" 
                  stroke="#FFBB28" 
                  strokeWidth={2}
                  dot={{ fill: '#FFBB28' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity by Module */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Actividad por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activityByModule}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activityByModule.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Rendimiento del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cpu" fill="#0088FE" name="CPU %" />
              <Bar dataKey="memory" fill="#00C49F" name="Memoria %" />
              <Bar dataKey="requests" fill="#FFBB28" name="Peticiones" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hay actividad reciente</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 10).map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.accion === 'LOGIN' ? 'bg-green-100 text-green-700' :
                      activity.accion === 'CREATE' ? 'bg-blue-100 text-blue-700' :
                      activity.accion === 'UPDATE' ? 'bg-yellow-100 text-yellow-700' :
                      activity.accion === 'DELETE' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {activity.accion}
                    </span>
                    <div>
                      <span className="text-sm font-medium">{activity.modulo}</span>
                      <p className="text-xs text-muted-foreground">{activity.descripcion}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleDateString('es-ES')}
                    </p>
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

import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Users, Building2, Shield, Activity } from 'lucide-react'

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getStats,
  })

  const stats = data?.data?.stats
  const recentActivity = data?.data?.recentActivity || []

  const cards = [
    { title: 'Usuarios', value: stats?.totalUsuarios ?? '-', icon: Users, color: 'text-blue-600 bg-blue-100' },
    { title: 'Áreas', value: stats?.totalAreas ?? '-', icon: Building2, color: 'text-green-600 bg-green-100' },
    { title: 'Roles', value: stats?.totalRoles ?? '-', icon: Shield, color: 'text-purple-600 bg-purple-100' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del sistema</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? '...' : card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              {recentActivity.slice(0, 8).map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.accion === 'LOGIN' ? 'bg-green-100 text-green-700' :
                      activity.accion === 'CREATE' ? 'bg-blue-100 text-blue-700' :
                      activity.accion === 'UPDATE' ? 'bg-yellow-100 text-yellow-700' :
                      activity.accion === 'DELETE' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {activity.accion}
                    </span>
                    <span className="text-sm">{activity.modulo}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleString('es-ES')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

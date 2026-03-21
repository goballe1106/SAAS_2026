import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, ChevronLeft, ChevronRight, Plus, ZoomIn, ZoomOut
} from 'lucide-react'

// Simulación de datos de Gantt
const PROYECTOS_EJEMPLO = [
  { id: 1, nombre: 'Obra Lima Centro', inicio: '2026-03-01', fin: '2026-06-30', progreso: 45, color: 'bg-blue-500' },
  { id: 2, nombre: 'Supervisión Javier Prado', inicio: '2026-03-15', fin: '2026-05-15', progreso: 30, color: 'bg-green-500' },
  { id: 3, nombre: 'Proyecto No Fidel', inicio: '2026-04-01', fin: '2026-08-30', progreso: 10, color: 'bg-purple-500' },
  { id: 4, nombre: 'Supervisión Banco', inicio: '2026-02-15', fin: '2026-04-30', progreso: 80, color: 'bg-orange-500' },
]

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const DIAS = Array.from({ length: 31 }, (_, i) => i + 1)

export default function GanttPage() {
  const [proyectos, setProyectos] = useState(PROYECTOS_EJEMPLO)
  const [mesActual, setMesActual] = useState(2) // Marzo = índice 2
  const [zoom, setZoom] = useState(1)

  const getPosicionBarra = (inicio: string, fin: string) => {
    const fechaInicio = new Date(inicio)
    const fechaFin = new Date(fin)
    const inicioMes = new Date(2026, mesActual, 1)
    const finMes = new Date(2026, mesActual + 1, 0)
    
    const diasDelMes = finMes.getDate()
    const offsetInicio = Math.max(0, Math.floor((fechaInicio.getTime() - inicioMes.getTime()) / (1000 * 60 * 60 * 24)))
    const offsetFin = Math.min(diasDelMes, Math.ceil((fechaFin.getTime() - inicioMes.getTime()) / (1000 * 60 * 60 * 24)))
    
    const izquierda = (offsetInicio / diasDelMes) * 100
    const ancho = ((offsetFin - offsetInicio) / diasDelMes) * 100
    
    return { izquierda: Math.max(0, izquierda), ancho: Math.max(5, ancho) }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-7 w-7 text-indigo-600" />
            Diagrama de Gantt
          </h1>
          <p className="text-gray-500">Línea de tiempo de proyectos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(2, zoom + 0.25))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Controles de mes */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setMesActual(Math.max(0, mesActual - 1))}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold">{MESES[mesActual]} 2026</h2>
            <Button variant="ghost" size="icon" onClick={() => setMesActual(Math.min(11, mesActual + 1))}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Gantt */}
      <Card>
        <CardHeader>
          <CardTitle>Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div style={{ minWidth: `${800 * zoom}px` }}>
              {/* Encabezado con días */}
              <div className="flex border-b">
                <div className="w-64 flex-shrink-0 p-2 font-medium text-gray-600 bg-gray-50">Proyecto</div>
                <div className="flex-1 flex">
                  {DIAS.map(dia => (
                    <div 
                      key={dia} 
                      className="flex-1 text-center text-xs text-gray-500 border-l py-1"
                      style={{ minWidth: `${25 * zoom}px` }}
                    >
                      {dia}
                    </div>
                  ))}
                </div>
              </div>

              {/* Filas de proyectos */}
              {proyectos.map(proyecto => {
                const posicion = getPosicionBarra(proyecto.inicio, proyecto.fin)
                const fechaInicio = new Date(proyecto.inicio)
                const fechaFin = new Date(proyecto.fin)
                
                return (
                  <div key={proyecto.id} className="flex border-b hover:bg-gray-50">
                    <div className="w-64 flex-shrink-0 p-3 font-medium text-sm bg-gray-50">
                      {proyecto.nombre}
                    </div>
                    <div className="flex-1 relative h-12">
                      {/* Líneas de días */}
                      <div className="absolute inset-0 flex">
                        {DIAS.map(dia => (
                          <div 
                            key={dia} 
                            className="flex-1 border-l"
                            style={{ minWidth: `${25 * zoom}px` }}
                          />
                        ))}
                      </div>
                      
                      {/* Barra del proyecto */}
                      {posicion.ancho > 0 && (
                        <div 
                          className={`absolute top-2 h-8 rounded-md ${proyecto.color} flex items-center justify-between px-2 text-white text-xs cursor-pointer hover:opacity-90 transition-opacity`}
                          style={{
                            left: `${posicion.izquierda}%`,
                            width: `${posicion.ancho}%`
                          }}
                        >
                          <span className="truncate font-medium">{proyecto.progreso}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leyenda */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            {proyectos.map(p => (
              <div key={p.id} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${p.color}`} />
                <span className="text-sm">{p.nombre}</span>
                <span className="text-xs text-gray-500">({p.progreso}%)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

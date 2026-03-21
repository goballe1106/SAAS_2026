import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<any[]>([])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Proyectos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total: {proyectos.length} proyectos</p>
          <p className="mt-4 text-gray-500">
            Aquí van los proyectos...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

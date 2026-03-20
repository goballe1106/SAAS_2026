import { useEffect, useState } from 'react'
import { areasService } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'

export default function AreasPage() {
  const [areas, setAreas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAreas()
  }, [])

  const loadAreas = async () => {
    try {
      const response = await areasService.getAll()
      if (response.success) {
        setAreas(response.data)
      }
    } catch (error) {
      console.error('Error loading areas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta área?')) {
      try {
        await areasService.delete(id)
        loadAreas()
      } catch (error) {
        console.error('Error deleting area:', error)
      }
    }
  }

  const getColorStyle = (color?: string) => {
    return color ? { backgroundColor: color + '20', borderColor: color, color } : {}
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Áreas</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Área
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar áreas..." className="pl-10" />
        </div>
        <Button variant="secondary">Buscar</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-10">Cargando...</div>
        ) : (
          areas.map((area) => (
            <Card key={area.id} style={getColorStyle(area.color)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{area.nombre}</CardTitle>
                  <span className="text-xs font-mono text-gray-500">{area.codigo}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipo:</span>
                    <span className="capitalize">{area.tipo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado:</span>
                    <span className={area.activo ? 'text-green-600' : 'text-red-600'}>
                      {area.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  {area.descripcion && (
                    <p className="text-gray-600 mt-2">{area.descripcion}</p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Pencil className="h-3 w-3 mr-1" /> Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDelete(area.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total: {clientes.length} clientes</p>
          <p className="mt-4 text-gray-500">
            Aquí van los clientes...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usuariosService, areasService, rolesService } from '../../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Users, Plus, Search, Trash2, Pencil, X, Loader2 } from 'lucide-react'

export default function UsuariosPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ email: '', password: '', nombre: '', apellido: '', telefono: '', areaId: '', rolId: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['usuarios', search],
    queryFn: () => usuariosService.getAll({ search, per_page: 50 }),
  })

  const { data: areasData } = useQuery({ queryKey: ['areas-options'], queryFn: areasService.getOptions })
  const { data: rolesData } = useQuery({ queryKey: ['roles-options'], queryFn: rolesService.getOptions })

  const createMutation = useMutation({
    mutationFn: (body: any) => usuariosService.create(body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['usuarios'] }); resetForm() },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: any) => usuariosService.update(id, body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['usuarios'] }); resetForm() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usuariosService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  })

  const resetForm = () => {
    setForm({ email: '', password: '', nombre: '', apellido: '', telefono: '', areaId: '', rolId: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateMutation.mutate({ id: editingId, body: { nombre: form.nombre, apellido: form.apellido, telefono: form.telefono, areaId: form.areaId || undefined } })
    } else {
      createMutation.mutate({ ...form, areaId: form.areaId || undefined, rolId: form.rolId || undefined })
    }
  }

  const handleEdit = (user: any) => {
    setForm({ email: user.email, password: '', nombre: user.nombre, apellido: user.apellido, telefono: user.telefono || '', areaId: user.areaId || '', rolId: '' })
    setEditingId(user.id)
    setShowForm(true)
  }

  const usuarios = data?.data || []
  const areas = areasData?.data || []
  const roles = rolesData?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6" /> Usuarios
          </h1>
          <p className="text-muted-foreground">Gestión de usuarios del sistema</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Usuario
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o email..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              {!editingId && (
                <>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contraseña</Label>
                    <Input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Apellido</Label>
                <Input required value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Área</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.areaId} onChange={(e) => setForm({ ...form, areaId: e.target.value })}>
                  <option value="">Sin área</option>
                  {areas.map((a: any) => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              {!editingId && (
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.rolId} onChange={(e) => setForm({ ...form, rolId: e.target.value })}>
                    <option value="">Sin rol</option>
                    {roles.map((r: any) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              )}
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingId ? 'Actualizar' : 'Crear'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Nombre</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Área</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Roles</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Estado</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : usuarios.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No hay usuarios</td></tr>
                ) : (
                  usuarios.map((user: any) => (
                    <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                            {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
                          </div>
                          <span className="font-medium">{user.nombre} {user.apellido}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{user.email}</td>
                      <td className="p-3 text-sm">{user.area?.nombre || '-'}</td>
                      <td className="p-3 text-sm">{user.roles?.join(', ') || '-'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.estado === 'activo' ? 'bg-green-100 text-green-700' :
                          user.estado === 'inactivo' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>{user.estado}</span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm('¿Eliminar este usuario?')) deleteMutation.mutate(user.id) }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

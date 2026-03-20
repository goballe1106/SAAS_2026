import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { areasService } from '../../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Building2, Plus, Trash2, Pencil, X, Loader2, ChevronRight, FolderTree } from 'lucide-react'

export default function AreasPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ nombre: '', codigo: '', descripcion: '', padreId: '' })

  const { data: treeData, isLoading } = useQuery({ queryKey: ['areas-tree'], queryFn: areasService.getTree })
  const { data: optionsData } = useQuery({ queryKey: ['areas-options'], queryFn: areasService.getOptions })

  const createMutation = useMutation({
    mutationFn: (body: any) => areasService.create(body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['areas-tree'] }); queryClient.invalidateQueries({ queryKey: ['areas-options'] }); resetForm() },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: any) => areasService.update(id, body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['areas-tree'] }); queryClient.invalidateQueries({ queryKey: ['areas-options'] }); resetForm() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => areasService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['areas-tree'] }); queryClient.invalidateQueries({ queryKey: ['areas-options'] }) },
  })

  const resetForm = () => {
    setForm({ nombre: '', codigo: '', descripcion: '', padreId: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = { ...form, padreId: form.padreId || null }
    if (editingId) {
      updateMutation.mutate({ id: editingId, body })
    } else {
      createMutation.mutate(body)
    }
  }

  const handleEdit = (area: any) => {
    setForm({ nombre: area.nombre, codigo: area.codigo || '', descripcion: area.descripcion || '', padreId: area.padreId || '' })
    setEditingId(area.id)
    setShowForm(true)
  }

  const tree = treeData?.data || []
  const options = optionsData?.data || []

  const renderTree = (nodes: any[], level = 0) => {
    return nodes.map((node: any) => (
      <div key={node.id}>
        <div
          className={`flex items-center justify-between py-2.5 px-3 hover:bg-muted/50 transition-colors border-b`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          <div className="flex items-center gap-2">
            {node.hijos?.length > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            {node.hijos?.length === 0 && <span className="w-4" />}
            <Building2 className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">{node.nombre}</span>
            {node.codigo && <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{node.codigo}</span>}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(node)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { if (confirm('¿Eliminar esta área?')) deleteMutation.mutate(node.id) }}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        {node.hijos?.length > 0 && renderTree(node.hijos, level + 1)}
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FolderTree className="h-6 w-6" /> Áreas
          </h1>
          <p className="text-muted-foreground">Estructura organizacional de la empresa</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Nueva Área
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">{editingId ? 'Editar Área' : 'Nueva Área'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Código</Label>
                <Input maxLength={20} value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Área Padre</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.padreId} onChange={(e) => setForm({ ...form, padreId: e.target.value })}>
                  <option value="">Ninguna (raíz)</option>
                  {options.map((a: any) => <option key={a.value} value={a.value}>{a.label} {a.codigo ? `(${a.codigo})` : ''}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
              </div>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Organigrama</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
          ) : tree.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No hay áreas creadas</div>
          ) : (
            renderTree(tree)
          )}
        </CardContent>
      </Card>
    </div>
  )
}

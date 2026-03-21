import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText, Search, Plus, Edit, Trash2, DollarSign, Calendar, User, 
  Building2, CheckCircle, Clock, AlertTriangle, Download, Send, XCircle,
  TrendingUp, TrendingDown, Receipt
} from 'lucide-react'

const ESTADOS_FACTURA = [
  { value: 'borrador', label: 'Borrador', color: 'bg-gray-100 text-gray-700', icon: FileText },
  { value: 'emitida', label: 'Emitida', color: 'bg-blue-100 text-blue-700', icon: Send },
  { value: 'pagada', label: 'Pagada', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  { value: 'vencida', label: 'Vencida', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  { value: 'cancelada', label: 'Cancelada', color: 'bg-gray-200 text-gray-600', icon: XCircle },
]

const TIPOS_DOCUMENTO = [
  { value: 'factura', label: 'Factura', desc: 'Documento fiscal' },
  { value: 'boleta', label: 'Boleta', desc: 'Venta menor' },
  { value: 'nota_credito', label: 'Nota de Crédito', desc: 'Ajuste negativo' },
  { value: 'nota_debito', label: 'Nota de Débito', desc: 'Ajuste positivo' },
  { value: 'recibo', label: 'Recibo', desc: 'Comprobante de pago' },
]

export default function FacturacionPage() {
  const [facturas, setFacturas] = useState<any[]>([
    { id: 1, numero: 'F001-00001', cliente: 'Empresa ABC S.A.C.', ruc: '20123456789', tipo: 'factura', monto: 15000, igv: 2700, fechaEmision: '2026-03-15', fechaVencimiento: '2026-04-15', estado: 'pagada' },
    { id: 2, numero: 'F001-00002', cliente: 'Constructora XYZ', ruc: '20198765432', tipo: 'factura', monto: 28000, igv: 5040, fechaEmision: '2026-03-18', fechaVencimiento: '2026-04-18', estado: 'emitida' },
    { id: 3, numero: 'F001-00003', cliente: 'Inmobiliaria 123', ruc: '20456789123', tipo: 'factura', monto: 8500, igv: 1530, fechaEmision: '2026-03-20', fechaVencimiento: '2026-04-20', estado: 'borrador' },
  ])
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({
    cliente: '', ruc: '', tipo: 'factura', fechaEmision: '', fechaVencimiento: '', descripcion: '', monto: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const igv = formData.monto * 0.18
    const nuevo = {
      ...formData,
      id: Date.now(),
      numero: `F001-${String(facturas.length + 1).padStart(5, '0')}`,
      igv,
      estado: 'borrador'
    }
    setFacturas([nuevo, ...facturas])
    setShowForm(false)
    setFormData({ cliente: '', ruc: '', tipo: 'factura', fechaEmision: '', fechaVencimiento: '', descripcion: '', monto: 0 })
  }

  const facturasFiltradas = facturas.filter(f => 
    f.cliente.toLowerCase().includes(search.toLowerCase()) || 
    f.numero.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: facturas.length,
    emitidas: facturas.filter(f => f.estado === 'emitida').length,
    pagadas: facturas.filter(f => f.estado === 'pagada').length,
    pendiente: facturas.filter(f => ['emitida', 'vencida'].includes(f.estado)).reduce((acc, f) => acc + f.monto, 0),
  }

  const totalMonto = facturas.reduce((acc, f) => acc + f.monto, 0)
  const totalIGV = facturas.reduce((acc, f) => acc + f.igv, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-7 w-7 text-green-600" />
            Facturación
          </h1>
          <p className="text-gray-500">Gestión de facturas y comprobantes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" /> Nueva Factura
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Facturado</p>
                <p className="text-2xl font-bold text-blue-700">S/ {totalMonto.toLocaleString()}</p>
                <p className="text-xs text-blue-600">+ IGV: S/ {totalIGV.toLocaleString()}</p>
              </div>
              <DollarSign className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Pagadas</p>
                <p className="text-3xl font-bold text-green-700">{stats.pagadas}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pendiente Cobro</p>
                <p className="text-2xl font-bold text-yellow-700">S/ {stats.pendiente.toLocaleString()}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Emitidas</p>
                <p className="text-3xl font-bold text-purple-700">{stats.emitidas}</p>
              </div>
              <Send className="h-10 w-10 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nueva Factura
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Cliente *</label>
                  <Input value={formData.cliente} onChange={(e) => setFormData({...formData, cliente: e.target.value})} required placeholder="Razón social" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">RUC</label>
                  <Input value={formData.ruc} onChange={(e) => setFormData({...formData, ruc: e.target.value})} placeholder="12345678901" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo Documento</label>
                  <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white">
                    {TIPOS_DOCUMENTO.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha Emisión</label>
                  <Input type="date" value={formData.fechaEmision} onChange={(e) => setFormData({...formData, fechaEmision: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha Vencimiento</label>
                  <Input type="date" value={formData.fechaVencimiento} onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Monto (S/)</label>
                  <Input type="number" value={formData.monto} onChange={(e) => setFormData({...formData, monto: Number(e.target.value)})} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción / Detalle</label>
                <Textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} className="mt-1" rows={3} placeholder="Descripción del servicio o producto..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">Crear Factura</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar factura..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="p-2 border rounded-md bg-white">
              <option value="">Todos los estados</option>
              {ESTADOS_FACTURA.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas ({facturasFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Número</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Cliente</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Tipo</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Vencimiento</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Monto</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Estado</th>
                  <th className="text-right p-3 text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturasFiltradas.map((fac) => {
                  const estado = ESTADOS_FACTURA.find(e => e.value === fac.estado)
                  const EstadoIcon = estado?.icon || FileText
                  return (
                    <tr key={fac.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <span className="font-medium text-blue-600">{fac.numero}</span>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{fac.cliente}</p>
                          <p className="text-xs text-gray-500">RUC: {fac.ruc}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {TIPOS_DOCUMENTO.find(t => t.value === fac.tipo)?.label}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{fac.fechaEmision}</td>
                      <td className="p-3 text-sm">{fac.fechaVencimiento}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">S/ {fac.monto.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">IGV: S/ {fac.igv.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${estado?.color}`}>
                          <EstadoIcon className="h-3 w-3" />
                          {estado?.label}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

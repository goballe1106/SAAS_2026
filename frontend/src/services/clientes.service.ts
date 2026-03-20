import { api } from './api'

export interface Cliente {
  id: string
  ruc?: string
  razonSocial: string
  nombreComercial?: string
  direccion?: string
  telefon?: string
  email?: string
  web?: string
  estado: 'prospecto' | 'activo' | 'inactivo' | 'potencial'
  sector?: string
  actividad?: string
  descripcion?: string
  notas?: string
  areaId?: string
  responsableId?: string
  createdAt: string
  updatedAt: string
  area?: {
    id: string
    nombre: string
  }
  responsable?: {
    id: string
    nombre: string
    apellido: string
    email: string
  }
}

export interface Contacto {
  id: string
  clienteId: string
  nombre: string
  apellido?: string
  cargo?: string
  tipo: 'principal' | 'facturacion' | 'tecnico' | 'comercial'
  telefono?: string
  email?: string
  celular?: string
  direccion?: string
  notas?: string
  esPrincipal: boolean
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface Oportunidad {
  id: string
  nombre: string
  descripcion?: string
  clienteId: string
  etapa: 'contacto' | 'calificacion' | 'propuesta' | 'negociacion' | 'codificado_ganado' | 'cerrado_perdido'
  valorEstimado?: number
  probabilidad?: number
  fechaCierre?: string
  origen?: string
  responsableId?: string
  areaId?: string
  motivoPerdida?: string
  createdAt: string
  updatedAt: string
}

export interface Cotizacion {
  id: string
  codigo: string
  clienteId: string
  oportunidadId?: string
  titulo: string
  descripcion?: string
  estado: 'borrador' | 'enviada' | 'aceptada' | 'rejectada' | 'convertida'
  fechaEmision: string
  fechaValidez?: string
  subtotal: number
  impuestos: number
  total: number
  moneda: string
  condiciones?: string
  notas?: string
  responsableId?: string
  areaId?: string
  proyectoId?: string
  createdAt: string
  updatedAt: string
}

export interface CotizacionItem {
  id: string
  cotizacionId: string
  itemCode?: string
  descripcion: string
  cantidad: number
  unidad: string
  tipo: string
  precioUnitario: number
  subtotal: number
  impuestos: number
  total: number
  orden: number
  createdAt: string
  updatedAt: string
}

export interface CreateClienteInput {
  ruc?: string
  razonSocial: string
  nombreComercial?: string
  direccion?: string
  telefono?: string
  email?: string
  web?: string
  estado?: 'prospecto' | 'activo' | 'inactivo' | 'potencial'
  sector?: string
  actividad?: string
  descripcion?: string
  notas?: string
  areaId?: string
  responsableId?: string
}

export interface UpdateClienteInput {
  ruc?: string
  razonSocial?: string
  nombreComercial?: string
  direccion?: string
  telefono?: string
  email?: string
  web?: string
  estado?: 'prospecto' | 'activo' | 'inactivo' | 'potencial'
  sector?: string
  actividad?: string
  descripcion?: string
  notas?: string
  areaId?: string
  responsableId?: string
}

export interface CreateContactoInput {
  nombre: string
  apellido?: string
  cargo?: string
  tipo?: 'principal' | 'facturacion' | 'tecnico' | 'comercial'
  telefono?: string
  email?: string
  celular?: string
  direccion?: string
  notas?: string
  esPrincipal?: boolean
  activo?: boolean
}

export interface ClientesResponse {
  data: Cliente[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ClienteDetalle extends Cliente {
  contactos: Contacto[]
  oportunidades: Oportunidad[]
  cotizaciones: Cotizacion[]
}

export interface ClientesStats {
  total: number
  porEstado: Array<{
    estado: string
    count: number
  }>
  porSector: Array<{
    sector: string
    count: number
  }>
  nuevosEsteMes: number
}

export const clientesService = {
  // Clientes
  async getClientes(page = 1, limit = 10, search?: string, estado?: string): Promise<ClientesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (search) params.append('search', search)
    if (estado) params.append('estado', estado)
    
    const response = await api.get(`/clientes?${params}`)
    return response.data
  },

  async getClienteById(id: string): Promise<ClienteDetalle> {
    const response = await api.get(`/clientes/${id}`)
    return response.data
  },

  async createCliente(data: CreateClienteInput): Promise<Cliente> {
    const response = await api.post('/clientes', data)
    return response.data
  },

  async updateCliente(id: string, data: UpdateClienteInput): Promise<Cliente> {
    const response = await api.put(`/clientes/${id}`, data)
    return response.data
  },

  async deleteCliente(id: string): Promise<Cliente> {
    const response = await api.delete(`/clientes/${id}`)
    return response.data
  },

  async getClientesOptions(search?: string): Promise<Cliente[]> {
    const params = search ? `?search=${search}` : ''
    const response = await api.get(`/clientes/options${params}`)
    return response.data
  },

  async getClientesStats(): Promise<ClientesStats> {
    const response = await api.get('/clientes/stats')
    return response.data
  },

  // Contactos
  async getContactosByCliente(clienteId: string): Promise<Contacto[]> {
    const response = await api.get(`/clientes/${clienteId}/contactos`)
    return response.data
  },

  async createContacto(clienteId: string, data: CreateContactoInput): Promise<Contacto> {
    const response = await api.post(`/clientes/${clienteId}/contactos`, data)
    return response.data
  },

  async updateContacto(id: string, data: Partial<CreateContactoInput>): Promise<Contacto> {
    const response = await api.put(`/contactos/${id}`, data)
    return response.data
  },

  async deleteContacto(id: string): Promise<Contacto> {
    const response = await api.delete(`/contactos/${id}`)
    return response.data
  },
}

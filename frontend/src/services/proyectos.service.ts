import { api } from './api'

export interface Proyecto {
  id: string
  nombre: string
  descripcion?: string
  codigo?: string
  clienteId?: string
  areaId?: string
  responsableId?: string
  estado: 'propuesta' | 'aprobado' | 'iniciado' | 'en_progreso' | 'en_revision' | 'cerrado' | 'pausado' | 'cancelado'
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  fechaInicio?: string
  fechaFin?: string
  fechaInicioReal?: string
  fechaFinReal?: string
  presupuesto?: number
  costoReal?: number
  progreso: number
  notas?: string
  createdAt: string
  updatedAt: string
  cliente?: {
    id: string
    razonSocial: string
    email?: string
    telefon?: string
  }
  responsable?: {
    id: string
    nombre: string
    apellido?: string
    email?: string
  }
  area?: {
    id: string
    nombre: string
  }
}

export interface CentroCosto {
  id: string
  nombre: string
  codigo?: string
  descripcion?: string
  padreId?: string
  areaId?: string
  responsableId?: string
  activo: boolean
  createdAt: string
  responsable?: {
    id: string
    nombre: string
    apellido?: string
  }
  area?: {
    id: string
    nombre: string
  }
}

export interface Hito {
  id: string
  proyectoId: string
  nombre: string
  descripcion?: string
  tipo: 'inicio' | 'entrega' | 'revision' | 'aprobacion' | 'cierre'
  fechaPlanificada: string
  fechaReal?: string
  completado: boolean
  responsableId?: string
  notas?: string
  createdAt: string
  responsable?: {
    id: string
    nombre: string
    apellido?: string
  }
}

export interface ProyectoRecurso {
  id: string
  proyectoId: string
  usuarioId: string
  areaId?: string
  rol: string
  estado: 'asignado' | 'disponible' | 'no_disponible'
  horasAsignadas?: number
  horasUtilizadas: number
  costoHora?: number
  fechaAsignacion: string
  fechaLiberacion?: string
  notas?: string
  createdAt: string
  usuario: {
    id: string
    nombre: string
    apellido: string
    email: string
  }
  area?: {
    id: string
    nombre: string
  }
}

export interface ProyectoDocumento {
  id: string
  proyectoId: string
  nombre: string
  descripcion?: string
  tipo: 'requisitos' | 'diseno' | 'contrato' | 'informe' | 'factura' | 'otros'
  url?: string
  tamano?: number
  version: string
  subidoPor: string
  fechaSubida: string
  etiquetas?: string
  createdAt: string
  subidoPorUsuario?: {
    id: string
    nombre: string
    apellido?: string
  }
}

export interface ProyectoSeguimiento {
  id: string
  proyectoId: string
  tipo: 'avance' | 'riesgo' | 'cambio' | 'decision' | 'problema'
  titulo: string
  descripcion?: string
  impacto?: string
  acciones?: string
  estado: string
  fechaReporte: string
  fechaCierre?: string
  reportadoPor: string
  createdAt: string
  reportadoPorUsuario?: {
    id: string
    nombre: string
    apellido?: string
  }
}

export interface CreateProyectoInput {
  nombre: string
  descripcion?: string
  codigo?: string
  clienteId?: string
  areaId?: string
  responsableId?: string
  estado?: 'propuesta' | 'aprobado' | 'iniciado' | 'en_progreso' | 'en_revision' | 'cerrado' | 'pausado' | 'cancelado'
  prioridad?: 'baja' | 'media' | 'alta' | 'critica'
  fechaInicio?: string
  fechaFin?: string
  presupuesto?: number
  notas?: string
}

export interface UpdateProyectoInput {
  nombre?: string
  descripcion?: string
  codigo?: string
  clienteId?: string
  areaId?: string
  responsableId?: string
  estado?: 'propuesta' | 'aprobado' | 'iniciado' | 'en_progreso' | 'en_revision' | 'cerrado' | 'pausado' | 'cancelado'
  prioridad?: 'baja' | 'media' | 'alta' | 'critica'
  fechaInicio?: string
  fechaFin?: string
  presupuesto?: number
  costoReal?: number
  progreso?: number
  notas?: string
}

export interface CreateCentroCostoInput {
  nombre: string
  codigo?: string
  descripcion?: string
  padreId?: string
  areaId?: string
  responsableId?: string
}

export interface CreateHitoInput {
  proyectoId: string
  nombre: string
  descripcion?: string
  tipo: 'inicio' | 'entrega' | 'revision' | 'aprobacion' | 'cierre'
  fechaPlanificada: string
  responsableId?: string
  notas?: string
}

export interface CreateRecursoInput {
  proyectoId: string
  usuarioId: string
  areaId?: string
  rol: string
  estado?: 'asignado' | 'disponible' | 'no_disponible'
  horasAsignadas?: number
  costoHora?: number
  fechaAsignacion: string
  notas?: string
}

export interface CreateDocumentoInput {
  proyectoId: string
  nombre: string
  descripcion?: string
  tipo: 'requisitos' | 'diseno' | 'contrato' | 'informe' | 'factura' | 'otros'
  url?: string
  tamano?: number
  version?: string
  etiquetas?: string
}

export interface CreateSeguimientoInput {
  proyectoId: string
  tipo: 'avance' | 'riesgo' | 'cambio' | 'decision' | 'problema'
  titulo: string
  descripcion?: string
  impacto?: string
  acciones?: string
  estado?: string
}

export interface ProyectosResponse {
  data: Proyecto[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ProyectoDetalle extends Proyecto {
  hitos: Hito[]
  recursos: ProyectoRecurso[]
  documentos: ProyectoDocumento[]
  seguimiento: ProyectoSeguimiento[]
}

export interface ProyectosStats {
  total: number
  porEstado: Array<{
    estado: string
    count: number
  }>
  porPrioridad: Array<{
    prioridad: string
    count: number
  }>
  presupuesto: {
    total: number
    costoReal: number
    proyectosConPresupuesto: number
  }
}

export const proyectosService = {
  // Proyectos
  async getProyectos(page = 1, limit = 10, search?: string, estado?: string, areaId?: string, responsableId?: string): Promise<ProyectosResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (search) params.append('search', search)
    if (estado) params.append('estado', estado)
    if (areaId) params.append('areaId', areaId)
    if (responsableId) params.append('responsableId', responsableId)
    
    const response = await api.get(`/proyectos?${params}`)
    return response.data
  },

  async getProyectoById(id: string): Promise<ProyectoDetalle> {
    const response = await api.get(`/proyectos/${id}`)
    return response.data
  },

  async createProyecto(data: CreateProyectoInput): Promise<Proyecto> {
    const response = await api.post('/proyectos', data)
    return response.data
  },

  async updateProyecto(id: string, data: UpdateProyectoInput): Promise<Proyecto> {
    const response = await api.put(`/proyectos/${id}`, data)
    return response.data
  },

  async deleteProyecto(id: string): Promise<Proyecto> {
    const response = await api.delete(`/proyectos/${id}`)
    return response.data
  },

  async getProyectosOptions(search?: string): Promise<Proyecto[]> {
    const params = search ? `?search=${search}` : ''
    const response = await api.get(`/proyectos/options${params}`)
    return response.data
  },

  async getProyectosStats(): Promise<ProyectosStats> {
    const response = await api.get('/proyectos/stats')
    return response.data
  },

  // Centros de Costo
  async getCentrosCosto(areaId?: string): Promise<CentroCosto[]> {
    const params = areaId ? `?areaId=${areaId}` : ''
    const response = await api.get(`/centros-costo${params}`)
    return response.data
  },

  async createCentroCosto(data: CreateCentroCostoInput): Promise<CentroCosto> {
    const response = await api.post('/centros-costo', data)
    return response.data
  },

  // Hitos
  async getHitosByProyecto(proyectoId: string): Promise<Hito[]> {
    const response = await api.get(`/proyectos/${proyectoId}/hitos`)
    return response.data
  },

  async createHito(data: CreateHitoInput): Promise<Hito> {
    const response = await api.post('/proyectos/${data.proyectoId}/hitos`, data)
    return response.data
  },

  // Recursos
  async getRecursosByProyecto(proyectoId: string): Promise<ProyectoRecurso[]> {
    const response = await api.get(`/proyectos/${proyectoId}/recursos`)
    return response.data
  },

  async createRecurso(data: CreateRecursoInput): Promise<ProyectoRecurso> {
    const response = await api.post(`/proyectos/${data.proyectoId}/recursos`, data)
    return response.data
  },

  // Documentos
  async getDocumentosByProyecto(proyectoId: string, tipo?: string): Promise<ProyectoDocumento[]> {
    const params = tipo ? `?tipo=${tipo}` : ''
    const response = await api.get(`/proyectos/${proyectoId}/documentos${params}`)
    return response.data
  },

  async createDocumento(data: CreateDocumentoInput): Promise<ProyectoDocumento> {
    const response = await api.post(`/proyectos/${data.proyectoId}/documentos`, data)
    return response.data
  },

  // Seguimiento
  async getSeguimientoByProyecto(proyectoId: string, tipo?: string): Promise<ProyectoSeguimiento[]> {
    const params = tipo ? `?tipo=${tipo}` : ''
    const response = await api.get(`/proyectos/${proyectoId}/seguimiento${params}`)
    return response.data
  },

  async createSeguimiento(data: CreateSeguimientoInput): Promise<ProyectoSeguimiento> {
    const response = await api.post(`/proyectos/${data.proyectoId}/seguimiento`, data)
    return response.data
  },
}

import { db } from '../db'
import { 
  proyectos, 
  centrosCosto, 
  hitos, 
  proyectoRecursos, 
  proyectoDocumentos, 
  proyectoSeguimiento,
  usuarios,
  areas,
  clientes
} from '../drizzle/schema'
import { eq, and, desc, asc, like, sql, count } from 'drizzle-orm'
import { z } from 'zod'

// Zod schemas for validation
export const createProyectoSchema = z.object({
  nombre: z.string().min(1).max(200),
  descripcion: z.string().optional(),
  codigo: z.string().max(50).optional(),
  clienteId: z.string().uuid().optional(),
  areaId: z.string().uuid().optional(),
  responsableId: z.string().uuid().optional(),
  estado: z.enum(['propuesta', 'aprobado', 'iniciado', 'en_progreso', 'en_revision', 'cerrado', 'pausado', 'cancelado']).default('propuesta'),
  prioridad: z.enum(['baja', 'media', 'alta', 'critica']).default('media'),
  fechaInicio: z.string().datetime().optional(),
  fechaFin: z.string().datetime().optional(),
  presupuesto: z.number().optional(),
  notas: z.string().optional(),
})

export const updateProyectoSchema = createProyectoSchema.partial()

export const createCentroCostoSchema = z.object({
  nombre: z.string().min(1).max(100),
  codigo: z.string().max(20).optional(),
  descripcion: z.string().optional(),
  padreId: z.string().uuid().optional(),
  areaId: z.string().uuid().optional(),
  responsableId: z.string().uuid().optional(),
})

export const createHitoSchema = z.object({
  proyectoId: z.string().uuid(),
  nombre: z.string().min(1).max(200),
  descripcion: z.string().optional(),
  tipo: z.enum(['inicio', 'entrega', 'revision', 'aprobacion', 'cierre']),
  fechaPlanificada: z.string().datetime(),
  responsableId: z.string().uuid().optional(),
  notas: z.string().optional(),
})

export const createRecursoSchema = z.object({
  proyectoId: z.string().uuid(),
  usuarioId: z.string().uuid(),
  areaId: z.string().uuid().optional(),
  rol: z.string().min(1).max(100),
  estado: z.enum(['asignado', 'disponible', 'no_disponible']).default('disponible'),
  horasAsignadas: z.number().optional(),
  costoHora: z.number().optional(),
  fechaAsignacion: z.string().datetime(),
  notas: z.string().optional(),
})

export const createDocumentoSchema = z.object({
  proyectoId: z.string().uuid(),
  nombre: z.string().min(1).max(255),
  descripcion: z.string().optional(),
  tipo: z.enum(['requisitos', 'diseno', 'contrato', 'informe', 'factura', 'otros']),
  url: z.string().max(500).optional(),
  tamano: z.number().optional(),
  version: z.string().max(20).default('1.0'),
  etiquetas: z.string().optional(),
})

export const createSeguimientoSchema = z.object({
  proyectoId: z.string().uuid(),
  tipo: z.enum(['avance', 'riesgo', 'cambio', 'decision', 'problema']),
  titulo: z.string().min(1).max(200),
  descripcion: z.string().optional(),
  impacto: z.string().max(20).optional(),
  acciones: z.string().optional(),
  estado: z.string().max(20).default('abierto'),
})

type CreateProyectoInput = z.infer<typeof createProyectoSchema>
type UpdateProyectoInput = z.infer<typeof updateProyectoSchema>
type CreateCentroCostoInput = z.infer<typeof createCentroCostoSchema>
type CreateHitoInput = z.infer<typeof createHitoSchema>
type CreateRecursoInput = z.infer<typeof createRecursoSchema>
type CreateDocumentoInput = z.infer<typeof createDocumentoSchema>
type CreateSeguimientoInput = z.infer<typeof createSeguimientoSchema>

export class ProyectosService {
  // PROYECTOS
  async getProyectos(page = 1, limit = 10, search?: string, estado?: string, areaId?: string, responsableId?: string) {
    const offset = (page - 1) * limit
    
    let whereConditions = []
    
    if (search) {
      whereConditions.push(
        sql`(p.nombre ILIKE ${'%' + search + '%'} OR p.codigo ILIKE ${'%' + search + '%'} OR p.descripcion ILIKE ${'%' + search + '%'})`
      )
    }
    
    if (estado) {
      whereConditions.push(eq(proyectos.estado, estado as any))
    }
    
    if (areaId) {
      whereConditions.push(eq(proyectos.areaId, areaId))
    }
    
    if (responsableId) {
      whereConditions.push(eq(proyectos.responsableId, responsableId))
    }

    const whereClause = whereConditions.length > 0 ? sql.join(whereConditions, sql` AND `) : sql``

    const projectsList = await db
      .select({
        id: proyectos.id,
        nombre: proyectos.nombre,
        descripcion: proyectos.descripcion,
        codigo: proyectos.codigo,
        estado: proyectos.estado,
        prioridad: proyectos.prioridad,
        fechaInicio: proyectos.fechaInicio,
        fechaFin: proyectos.fechaFin,
        presupuesto: proyectos.presupuesto,
        costoReal: proyectos.costoReal,
        progreso: proyectos.progreso,
        createdAt: proyectos.createdAt,
        updatedAt: proyectos.updatedAt,
        cliente: {
          id: clientes.id,
          razonSocial: clientes.razonSocial,
        },
        responsable: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellido: usuarios.apellido,
          email: usuarios.email,
        },
        area: {
          id: areas.id,
          nombre: areas.nombre,
        },
      })
      .from(proyectos)
      .leftJoin(clientes, eq(proyectos.clienteId, clientes.id))
      .leftJoin(usuarios, eq(proyectos.responsableId, usuarios.id))
      .leftJoin(areas, eq(proyectos.areaId, areas.id))
      .where(whereClause)
      .orderBy(desc(proyectos.createdAt))
      .limit(limit)
      .offset(offset)

    const totalCount = await db
      .select({ count: count() })
      .from(proyectos)
      .where(whereClause)
      .then(result => result[0]?.count || 0)

    return {
      data: projectsList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  }

  async getProyectoById(id: string) {
    const result = await db
      .select({
        id: proyectos.id,
        nombre: proyectos.nombre,
        descripcion: proyectos.descripcion,
        codigo: proyectos.codigo,
        clienteId: proyectos.clienteId,
        areaId: proyectos.areaId,
        responsableId: proyectos.responsableId,
        estado: proyectos.estado,
        prioridad: proyectos.prioridad,
        fechaInicio: proyectos.fechaInicio,
        fechaFin: proyectos.fechaFin,
        fechaInicioReal: proyectos.fechaInicioReal,
        fechaFinReal: proyectos.fechaFinReal,
        presupuesto: proyectos.presupuesto,
        costoReal: proyectos.costoReal,
        progreso: proyectos.progreso,
        notas: proyectos.notas,
        createdAt: proyectos.createdAt,
        updatedAt: proyectos.updatedAt,
        cliente: {
          id: clientes.id,
          razonSocial: clientes.razonSocial,
          email: clientes.email,
          telefon: clientes.telefon,
        },
        responsable: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellido: usuarios.apellido,
          email: usuarios.email,
        },
        area: {
          id: areas.id,
          nombre: areas.nombre,
        },
      })
      .from(proyectos)
      .leftJoin(clientes, eq(proyectos.clienteId, clientes.id))
      .leftJoin(usuarios, eq(proyectos.responsableId, usuarios.id))
      .leftJoin(areas, eq(proyectos.areaId, areas.id))
      .where(eq(proyectos.id, id))
      .limit(1)

    return result[0] || null
  }

  async createProyecto(data: CreateProyectoInput) {
    const result = await db
      .insert(proyectos)
      .values(data)
      .returning()
    
    return result[0]
  }

  async updateProyecto(id: string, data: UpdateProyectoInput) {
    const result = await db
      .update(proyectos)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(proyectos.id, id))
      .returning()
    
    return result[0]
  }

  async deleteProyecto(id: string) {
    const result = await db
      .delete(proyectos)
      .where(eq(proyectos.id, id))
      .returning()
    
    return result[0]
  }

  async getProyectosOptions(search?: string) {
    let whereClause = sql``
    
    if (search) {
      whereClause = sql`(p.nombre ILIKE ${'%' + search + '%'} OR p.codigo ILIKE ${'%' + search + '%'})`
    }

    return await db
      .select({
        id: proyectos.id,
        nombre: proyectos.nombre,
        codigo: proyectos.codigo,
        estado: proyectos.estado,
      })
      .from(proyectos)
      .where(whereClause)
      .orderBy(asc(proyectos.nombre))
      .limit(50)
  }

  async getProyectosStats() {
    const [
      totalResult,
      estadoResult,
      prioridadResult,
      presupuestoResult
    ] = await Promise.all([
      db.select({ count: count() }).from(proyectos),
      db
        .select({
          estado: proyectos.estado,
          count: count(),
        })
        .from(proyectos)
        .groupBy(proyectos.estado),
      db
        .select({
          prioridad: proyectos.prioridad,
          count: count(),
        })
        .from(proyectos)
        .groupBy(proyectos.prioridad),
      db
        .select({
          totalPresupuesto: sql`SUM(presupuesto)`.mapWith(Number),
          totalCostoReal: sql`SUM(costo_real)`.mapWith(Number),
          totalProyectos: count(),
        })
        .from(proyectos)
    ])

    return {
      total: totalResult[0]?.count || 0,
      porEstado: estadoResult,
      porPrioridad: prioridadResult,
      presupuesto: {
        total: presupuestoResult[0]?.totalPresupuesto || 0,
        costoReal: presupuestoResult[0]?.totalCostoReal || 0,
        proyectosConPresupuesto: presupuestoResult[0]?.totalProyectos || 0,
      }
    }
  }

  // CENTROS DE COSTO
  async getCentrosCosto(areaId?: string) {
    const whereClause = areaId ? eq(centrosCosto.areaId, areaId) : sql``
    
    return await db
      .select({
        id: centrosCosto.id,
        nombre: centrosCosto.nombre,
        codigo: centrosCosto.codigo,
        descripcion: centrosCosto.descripcion,
        padreId: centrosCosto.padreId,
        areaId: centrosCosto.areaId,
        responsableId: centrosCosto.responsableId,
        activo: centrosCosto.activo,
        createdAt: centrosCosto.createdAt,
        responsable: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellido: usuarios.apellido,
        },
        area: {
          id: areas.id,
          nombre: areas.nombre,
        },
      })
      .from(centrosCosto)
      .leftJoin(usuarios, eq(centrosCosto.responsableId, usuarios.id))
      .leftJoin(areas, eq(centrosCosto.areaId, areas.id))
      .where(whereClause)
      .orderBy(asc(centrosCosto.nombre))
  }

  async createCentroCosto(data: CreateCentroCostoInput) {
    const result = await db
      .insert(centrosCosto)
      .values(data)
      .returning()
    
    return result[0]
  }

  // HITOS
  async getHitosByProyecto(proyectoId: string) {
    return await db
      .select({
        id: hitos.id,
        nombre: hitos.nombre,
        descripcion: hitos.descripcion,
        tipo: hitos.tipo,
        fechaPlanificada: hitos.fechaPlanificada,
        fechaReal: hitos.fechaReal,
        completado: hitos.completado,
        responsableId: hitos.responsableId,
        notas: hitos.notas,
        createdAt: hitos.createdAt,
        responsable: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellido: usuarios.apellido,
        },
      })
      .from(hitos)
      .leftJoin(usuarios, eq(hitos.responsableId, usuarios.id))
      .where(eq(hitos.proyectoId, proyectoId))
      .orderBy(asc(hitos.fechaPlanificada))
  }

  async createHito(data: CreateHitoInput) {
    const result = await db
      .insert(hitos)
      .values(data)
      .returning()
    
    return result[0]
  }

  // RECURSOS
  async getRecursosByProyecto(proyectoId: string) {
    return await db
      .select({
        id: proyectoRecursos.id,
        rol: proyectoRecursos.rol,
        estado: proyectoRecursos.estado,
        horasAsignadas: proyectoRecursos.horasAsignadas,
        horasUtilizadas: proyectoRecursos.horasUtilizadas,
        costoHora: proyectoRecursos.costoHora,
        fechaAsignacion: proyectoRecursos.fechaAsignacion,
        fechaLiberacion: proyectoRecursos.fechaLiberacion,
        notas: proyectoRecursos.notas,
        usuario: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellido: usuarios.apellido,
          email: usuarios.email,
        },
        area: {
          id: areas.id,
          nombre: areas.nombre,
        },
      })
      .from(proyectoRecursos)
      .leftJoin(usuarios, eq(proyectoRecursos.usuarioId, usuarios.id))
      .leftJoin(areas, eq(proyectoRecursos.areaId, areas.id))
      .where(eq(proyectoRecursos.proyectoId, proyectoId))
      .orderBy(asc(proyectoRecursos.rol))
  }

  async createRecurso(data: CreateRecursoInput) {
    const result = await db
      .insert(proyectoRecursos)
      .values(data)
      .returning()
    
    return result[0]
  }

  // DOCUMENTOS
  async getDocumentosByProyecto(proyectoId: string, tipo?: string) {
    let whereClause = eq(proyectoDocumentos.proyectoId, proyectoId)
    
    if (tipo) {
      whereClause = and(whereClause, eq(proyectoDocumentos.tipo, tipo))
    }

    return await db
      .select({
        id: proyectoDocumentos.id,
        nombre: proyectoDocumentos.nombre,
        descripcion: proyectoDocumentos.descripcion,
        tipo: proyectoDocumentos.tipo,
        url: proyectoDocumentos.url,
        tamano: proyectoDocumentos.tamano,
        version: proyectoDocumentos.version,
        subidoPor: proyectoDocumentos.subidoPor,
        fechaSubida: proyectoDocumentos.fechaSubida,
        etiquetas: proyectoDocumentos.etiquetas,
        createdAt: proyectoDocumentos.createdAt,
        subidoPorUsuario: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellido: usuarios.apellido,
        },
      })
      .from(proyectoDocumentos)
      .leftJoin(usuarios, eq(proyectoDocumentos.subidoPor, usuarios.id))
      .where(whereClause)
      .orderBy(desc(proyectoDocumentos.fechaSubida))
  }

  async createDocumento(data: CreateDocumentoInput) {
    const result = await db
      .insert(proyectoDocumentos)
      .values(data)
      .returning()
    
    return result[0]
  }

  // SEGUIMIENTO
  async getSeguimientoByProyecto(proyectoId: string, tipo?: string) {
    let whereClause = eq(proyectoSeguimiento.proyectoId, proyectoId)
    
    if (tipo) {
      whereClause = and(whereClause, eq(proyectoSeguimiento.tipo, tipo))
    }

    return await db
      .select({
        id: proyectoSeguimiento.id,
        tipo: proyectoSeguimiento.tipo,
        titulo: proyectoSeguimiento.titulo,
        descripcion: proyectoSeguimiento.descripcion,
        impacto: proyectoSeguimiento.impacto,
        acciones: proyectoSeguimiento.acciones,
        estado: proyectoSeguimiento.estado,
        fechaReporte: proyectoSeguimiento.fechaReporte,
        fechaCierre: proyectoSeguimiento.fechaCierre,
        reportadoPor: proyectoSeguimiento.reportadoPor,
        createdAt: proyectoSeguimiento.createdAt,
        reportadoPorUsuario: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellido: usuarios.apellido,
        },
      })
      .from(proyectoSeguimiento)
      .leftJoin(usuarios, eq(proyectoSeguimiento.reportadoPor, usuarios.id))
      .where(whereClause)
      .orderBy(desc(proyectoSeguimiento.fechaReporte))
  }

  async createSeguimiento(data: CreateSeguimientoInput) {
    const result = await db
      .insert(proyectoSeguimiento)
      .values(data)
      .returning()
    
    return result[0]
  }
}

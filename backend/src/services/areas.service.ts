import { eq, isNull, asc } from 'drizzle-orm'
import { db } from '../config/database'
import { areas, auditoriaLogs } from '../drizzle/schema'

interface CreateAreaInput {
  nombre: string
  codigo?: string
  descripcion?: string
  padreId?: string | null
  responsableId?: string | null
  orden?: number
}

interface UpdateAreaInput {
  nombre?: string
  codigo?: string
  descripcion?: string
  padreId?: string | null
  responsableId?: string | null
  activo?: boolean
  orden?: number
}

export class AreasService {
  static async list() {
    return db.query.areas.findMany({
      with: {
        padre: true,
        responsable: {
          columns: { id: true, nombre: true, apellido: true, email: true },
        },
      },
      orderBy: [asc(areas.orden), asc(areas.nombre)],
    })
  }

  static async getTree() {
    const allAreas = await db.query.areas.findMany({
      with: {
        responsable: {
          columns: { id: true, nombre: true, apellido: true },
        },
      },
      orderBy: [asc(areas.orden), asc(areas.nombre)],
    })

    const buildTree = (parentId: string | null): any[] => {
      return allAreas
        .filter(a => a.padreId === parentId)
        .map(a => ({
          ...a,
          hijos: buildTree(a.id),
        }))
    }

    return buildTree(null)
  }

  static async getOptions() {
    return db.select({
      value: areas.id,
      label: areas.nombre,
      codigo: areas.codigo,
    }).from(areas).where(eq(areas.activo, true)).orderBy(asc(areas.nombre))
  }

  static async getById(id: string) {
    const area = await db.query.areas.findFirst({
      where: eq(areas.id, id),
      with: {
        padre: true,
        hijos: true,
        usuarios: {
          columns: { id: true, nombre: true, apellido: true, email: true },
        },
        responsable: {
          columns: { id: true, nombre: true, apellido: true },
        },
      },
    })

    if (!area) {
      throw { statusCode: 404, message: 'Área no encontrada' }
    }

    return area
  }

  static async create(input: CreateAreaInput, createdBy?: string) {
    const [area] = await db.insert(areas).values({
      nombre: input.nombre,
      codigo: input.codigo,
      descripcion: input.descripcion,
      padreId: input.padreId,
      responsableId: input.responsableId,
      orden: input.orden || 0,
    }).returning()

    if (createdBy) {
      await db.insert(auditoriaLogs).values({
        usuarioId: createdBy,
        accion: 'CREATE',
        modulo: 'areas',
        registroId: area.id,
        datosNuevos: { nombre: area.nombre, codigo: area.codigo },
      })
    }

    return this.getById(area.id)
  }

  static async update(id: string, input: UpdateAreaInput, updatedBy?: string) {
    const existing = await db.query.areas.findFirst({
      where: eq(areas.id, id),
    })

    if (!existing) {
      throw { statusCode: 404, message: 'Área no encontrada' }
    }

    const [updated] = await db.update(areas)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(areas.id, id))
      .returning()

    if (updatedBy) {
      await db.insert(auditoriaLogs).values({
        usuarioId: updatedBy,
        accion: 'UPDATE',
        modulo: 'areas',
        registroId: id,
        datosAnteriores: { nombre: existing.nombre },
        datosNuevos: input,
      })
    }

    return this.getById(updated.id)
  }

  static async delete(id: string, deletedBy?: string) {
    const existing = await db.query.areas.findFirst({
      where: eq(areas.id, id),
      with: { hijos: true },
    })

    if (!existing) {
      throw { statusCode: 404, message: 'Área no encontrada' }
    }

    if (existing.hijos.length > 0) {
      throw { statusCode: 400, message: 'No se puede eliminar un área con sub-áreas. Elimine primero las sub-áreas.' }
    }

    await db.delete(areas).where(eq(areas.id, id))

    if (deletedBy) {
      await db.insert(auditoriaLogs).values({
        usuarioId: deletedBy,
        accion: 'DELETE',
        modulo: 'areas',
        registroId: id,
        datosAnteriores: { nombre: existing.nombre, codigo: existing.codigo },
      })
    }

    return { success: true, message: 'Área eliminada' }
  }
}

import { eq, ilike, and, sql, desc } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { db } from '../config/database'
import { usuarios, usuariosRoles, roles, auditoriaLogs } from '../drizzle/schema'

interface CreateUsuarioInput {
  email: string
  password: string
  nombre: string
  apellido: string
  telefono?: string
  areaId?: string
  rolId?: string
}

interface UpdateUsuarioInput {
  nombre?: string
  apellido?: string
  telefono?: string
  areaId?: string | null
  estado?: 'activo' | 'inactivo' | 'bloqueado'
}

interface ListParams {
  page?: number
  perPage?: number
  search?: string
  estado?: string
  areaId?: string
}

export class UsuariosService {
  static async list(params: ListParams) {
    const page = params.page || 1
    const perPage = params.perPage || 20
    const offset = (page - 1) * perPage

    const conditions = []

    if (params.search) {
      conditions.push(
        sql`(${usuarios.nombre} ILIKE ${`%${params.search}%`} OR ${usuarios.apellido} ILIKE ${`%${params.search}%`} OR ${usuarios.email} ILIKE ${`%${params.search}%`})`
      )
    }

    if (params.estado) {
      conditions.push(eq(usuarios.estado, params.estado as any))
    }

    if (params.areaId) {
      conditions.push(eq(usuarios.areaId, params.areaId))
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [data, countResult] = await Promise.all([
      db.query.usuarios.findMany({
        where,
        with: {
          area: true,
          usuariosRoles: {
            with: { rol: true },
          },
        },
        limit: perPage,
        offset,
        orderBy: [desc(usuarios.createdAt)],
        columns: {
          password: false,
        },
      }),
      db.select({ count: sql<number>`count(*)` })
        .from(usuarios)
        .where(where),
    ])

    const total = Number(countResult[0].count)

    return {
      data: data.map((u: any) => ({
        ...u,
        roles: u.usuariosRoles.map((ur: any) => ur.rol.nombre),
      })),
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    }
  }

  static async getById(id: string) {
    const user = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, id),
      with: {
        area: true,
        usuariosRoles: {
          with: { rol: true, area: true },
        },
      },
      columns: {
        password: false,
      },
    })

    if (!user) {
      throw { statusCode: 404, message: 'Usuario no encontrado' }
    }

    return {
      ...user,
      roles: user.usuariosRoles.map((ur: any) => ({
        id: ur.rol.id,
        nombre: ur.rol.nombre,
        nivel: ur.rol.nivel,
        area: ur.area?.nombre || null,
      })),
    }
  }

  static async create(input: CreateUsuarioInput, createdBy?: string) {
    const existing = await db.query.usuarios.findFirst({
      where: eq(usuarios.email, input.email),
    })

    if (existing) {
      throw { statusCode: 409, message: 'Ya existe un usuario con ese email' }
    }

    const hashedPassword = await bcrypt.hash(input.password, 12)

    const [user] = await db.insert(usuarios).values({
      email: input.email,
      password: hashedPassword,
      nombre: input.nombre,
      apellido: input.apellido,
      telefono: input.telefono,
      areaId: input.areaId,
    }).returning()

    if (input.rolId) {
      await db.insert(usuariosRoles).values({
        usuarioId: user.id,
        rolId: input.rolId,
      })
    }

    if (createdBy) {
      await db.insert(auditoriaLogs).values({
        usuarioId: createdBy,
        accion: 'CREATE',
        modulo: 'usuarios',
        registroId: user.id,
        datosNuevos: { email: user.email, nombre: user.nombre, apellido: user.apellido },
      })
    }

    return this.getById(user.id)
  }

  static async update(id: string, input: UpdateUsuarioInput, updatedBy?: string) {
    const existing = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, id),
    })

    if (!existing) {
      throw { statusCode: 404, message: 'Usuario no encontrado' }
    }

    const [updated] = await db.update(usuarios)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(usuarios.id, id))
      .returning()

    if (updatedBy) {
      await db.insert(auditoriaLogs).values({
        usuarioId: updatedBy,
        accion: 'UPDATE',
        modulo: 'usuarios',
        registroId: id,
        datosAnteriores: { nombre: existing.nombre, apellido: existing.apellido, estado: existing.estado },
        datosNuevos: input,
      })
    }

    return this.getById(updated.id)
  }

  static async delete(id: string, deletedBy?: string) {
    const existing = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, id),
    })

    if (!existing) {
      throw { statusCode: 404, message: 'Usuario no encontrado' }
    }

    await db.delete(usuarios).where(eq(usuarios.id, id))

    if (deletedBy) {
      await db.insert(auditoriaLogs).values({
        usuarioId: deletedBy,
        accion: 'DELETE',
        modulo: 'usuarios',
        registroId: id,
        datosAnteriores: { email: existing.email, nombre: existing.nombre },
      })
    }

    return { success: true, message: 'Usuario eliminado' }
  }
}

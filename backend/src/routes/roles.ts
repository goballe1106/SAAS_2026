import { FastifyInstance } from 'fastify'
import { eq, asc } from 'drizzle-orm'
import { db } from '../config/database'
import { roles, rolesPermisos, permisos } from '../drizzle/schema'
import { authGuard } from '../middleware/auth'

export async function rolesRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authGuard)

  // GET /api/v1/roles
  fastify.get('/', async (request, reply) => {
    const data = await db.query.roles.findMany({
      with: {
        rolesPermisos: {
          with: { permiso: true },
        },
      },
      orderBy: [asc(roles.nombre)],
    })

    return {
      success: true,
      data: data.map((r: any) => ({
        ...r,
        permisos: r.rolesPermisos.map((rp: any) => rp.permiso),
      })),
    }
  })

  // GET /api/v1/roles/options
  fastify.get('/options', async (request, reply) => {
    const data = await db.select({
      value: roles.id,
      label: roles.nombre,
      nivel: roles.nivel,
    }).from(roles).where(eq(roles.activo, true)).orderBy(asc(roles.nombre))

    return { success: true, data }
  })
}

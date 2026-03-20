import { FastifyInstance } from 'fastify'
import { sql } from 'drizzle-orm'
import { db } from '../config/database'
import { usuarios, areas, roles, auditoriaLogs } from '../drizzle/schema'
import { authGuard } from '../middleware/auth'

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authGuard)

  // GET /api/v1/dashboard
  fastify.get('/', async (request, reply) => {
    const [
      usuariosCount,
      areasCount,
      rolesCount,
      recentActivity,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(usuarios),
      db.select({ count: sql<number>`count(*)` }).from(areas),
      db.select({ count: sql<number>`count(*)` }).from(roles),
      db.select().from(auditoriaLogs).orderBy(sql`created_at DESC`).limit(10),
    ])

    return {
      success: true,
      data: {
        stats: {
          totalUsuarios: Number(usuariosCount[0].count),
          totalAreas: Number(areasCount[0].count),
          totalRoles: Number(rolesCount[0].count),
        },
        recentActivity,
      },
    }
  })
}

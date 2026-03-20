import { FastifyInstance } from 'fastify';
import { db } from '../config/database.js';
import { usuarios, areas } from '../drizzle/schema/index.js';
import { eq, count, sql } from 'drizzle-orm';

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    try {
      const usuariosActivos = await db.select({ count: count() }).from(usuarios).where(eq(usuarios.activo, true));
      const areasActivas = await db.select({ count: count() }).from(areas).where(eq(areas.activo, true));
      const usuariosPorRol = await db.select({ rol: usuarios.rol, count: sql`count(*)::int` }).from(usuarios).where(eq(usuarios.activo, true)).groupBy(usuarios.rol);
      const usuariosRecientes = await db.select({ id: usuarios.id, nombreCompleto: usuarios.nombreCompleto, email: usuarios.email, rol: usuarios.rol, createdAt: usuarios.createdAt })
        .from(usuarios).orderBy(sql`${usuarios.createdAt} desc`).limit(5);

      return reply.send({
        success: true,
        data: {
          stats: { usuariosActivos: usuariosActivos[0]?.count || 0, areasActivas: areasActivas[0]?.count || 0 },
          usuariosPorRol,
          usuariosRecientes,
        },
      });
    } catch (error) {
      console.error('Error en dashboard:', error);
      throw error;
    }
  });
}

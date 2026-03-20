import { FastifyInstance } from 'fastify';
import { db } from '../config/database.js';
import { roles, permisos, rolesPermisos } from '../drizzle/schema/index.js';
import { eq } from 'drizzle-orm';

export async function rolesRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    try {
      const result = await db.select().from(roles).orderBy(roles.nivel);
      return reply.send({ success: true, data: result });
    } catch (error) { throw error; }
  });

  fastify.get('/permisos', async (request, reply) => {
    try {
      const result = await db.select().from(permisos);
      return reply.send({ success: true, data: result });
    } catch (error) { throw error; }
  });

  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const result = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
      if (result.length === 0) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND' } });
      return reply.send({ success: true, data: result[0] });
    } catch (error) { throw error; }
  });

  fastify.post('/', async (request, reply) => {
    try {
      const body = request.body as any;
      const result = await db.insert(roles).values(body).returning();
      return reply.status(201).send({ success: true, data: result[0] });
    } catch (error: any) {
      return reply.status(400).send({ success: false, error: { message: error.message } });
    }
  });

  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const body = request.body as any;
      const result = await db.update(roles).set({ ...body, updatedAt: new Date() }).where(eq(roles.id, id)).returning();
      if (result.length === 0) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND' } });
      return reply.send({ success: true, data: result[0] });
    } catch (error: any) {
      return reply.status(400).send({ success: false, error: { message: error.message } });
    }
  });

  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      await db.update(roles).set({ activo: false, updatedAt: new Date() }).where(eq(roles.id, id));
      return reply.send({ success: true, message: 'Rol eliminado correctamente' });
    } catch (error) { throw error; }
  });
}

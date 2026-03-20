import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { usuariosService } from '../services/usuarios.service';

export async function usuariosRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    try {
      const filters = request.query as any;
      const result = await usuariosService.findAll(filters);
      return reply.send({ success: true, data: result.data, meta: result.meta });
    } catch (error) { throw error; }
  });

  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const user = await usuariosService.findById(id);
      if (!user) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND' } });
      return reply.send({ success: true, data: user });
    } catch (error) { throw error; }
  });

  fastify.post('/', async (request, reply) => {
    try {
      const body = request.body as any;
      const user = await usuariosService.create(body);
      return reply.status(201).send({ success: true, data: user });
    } catch (error: any) {
      return reply.status(400).send({ success: false, error: { message: error.message } });
    }
  });

  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const body = request.body as any;
      const user = await usuariosService.update(id, body);
      return reply.send({ success: true, data: user });
    } catch (error: any) {
      return reply.status(400).send({ success: false, error: { message: error.message } });
    }
  });

  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      await usuariosService.delete(id);
      return reply.send({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) { throw error; }
  });
}

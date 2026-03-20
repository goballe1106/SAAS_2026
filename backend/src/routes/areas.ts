import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { areasService } from '../services/areas.service';

export async function areasRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    try {
      const includeInactive = (request.query as any).includeInactive === 'true';
      const areas = await areasService.findAll(includeInactive);
      return reply.send({ success: true, data: areas });
    } catch (error) { throw error; }
  });

  fastify.get('/tree', async (request, reply) => {
    try {
      const tree = await areasService.findTree();
      return reply.send({ success: true, data: tree });
    } catch (error) { throw error; }
  });

  fastify.get('/options', async (request, reply) => {
    try {
      const options = await areasService.findOptions();
      return reply.send({ success: true, data: options });
    } catch (error) { throw error; }
  });

  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const area = await areasService.findById(id);
      if (!area) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND' } });
      return reply.send({ success: true, data: area });
    } catch (error) { throw error; }
  });

  fastify.post('/', async (request, reply) => {
    try {
      const body = request.body as any;
      const area = await areasService.create(body);
      return reply.status(201).send({ success: true, data: area });
    } catch (error: any) {
      return reply.status(400).send({ success: false, error: { message: error.message } });
    }
  });

  fastify.put('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      const body = request.body as any;
      const area = await areasService.update(id, body);
      return reply.send({ success: true, data: area });
    } catch (error: any) {
      return reply.status(400).send({ success: false, error: { message: error.message } });
    }
  });

  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as any;
      await areasService.delete(id);
      return reply.send({ success: true, message: 'Área eliminada correctamente' });
    } catch (error: any) {
      return reply.status(400).send({ success: false, error: { message: error.message } });
    }
  });
}

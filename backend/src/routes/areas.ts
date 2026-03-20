import { FastifyInstance } from 'fastify'
import { AreasService } from '../services/areas.service'
import { authGuard, adminGuard } from '../middleware/auth'
import { z } from 'zod'

const createSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  codigo: z.string().max(20).optional(),
  descripcion: z.string().optional(),
  padreId: z.string().uuid().nullable().optional(),
  responsableId: z.string().uuid().nullable().optional(),
  orden: z.number().int().optional(),
})

const updateSchema = z.object({
  nombre: z.string().min(1).optional(),
  codigo: z.string().max(20).optional(),
  descripcion: z.string().optional(),
  padreId: z.string().uuid().nullable().optional(),
  responsableId: z.string().uuid().nullable().optional(),
  activo: z.boolean().optional(),
  orden: z.number().int().optional(),
})

export async function areasRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authGuard)

  // GET /api/v1/areas
  fastify.get('/', async (request, reply) => {
    const data = await AreasService.list()
    return { success: true, data }
  })

  // GET /api/v1/areas/tree
  fastify.get('/tree', async (request, reply) => {
    const data = await AreasService.getTree()
    return { success: true, data }
  })

  // GET /api/v1/areas/options
  fastify.get('/options', async (request, reply) => {
    const data = await AreasService.getOptions()
    return { success: true, data }
  })

  // GET /api/v1/areas/:id
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as any
    const data = await AreasService.getById(id)
    return { success: true, data }
  })

  // POST /api/v1/areas
  fastify.post('/', { preHandler: [adminGuard] }, async (request, reply) => {
    const body = createSchema.parse(request.body)
    const currentUser = request.user as any
    const data = await AreasService.create(body, currentUser.id)
    reply.status(201)
    return { success: true, data }
  })

  // PUT /api/v1/areas/:id
  fastify.put('/:id', { preHandler: [adminGuard] }, async (request, reply) => {
    const { id } = request.params as any
    const body = updateSchema.parse(request.body)
    const currentUser = request.user as any
    const data = await AreasService.update(id, body, currentUser.id)
    return { success: true, data }
  })

  // DELETE /api/v1/areas/:id
  fastify.delete('/:id', { preHandler: [adminGuard] }, async (request, reply) => {
    const { id } = request.params as any
    const currentUser = request.user as any
    const data = await AreasService.delete(id, currentUser.id)
    return { success: true, data }
  })
}

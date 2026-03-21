import { FastifyInstance } from 'fastify'
import { UsuariosService } from '../services/usuarios.service'
import { authGuard, adminGuard } from '../middleware/auth'
import { z } from 'zod'

const createSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  nombre: z.string().min(1, 'Nombre requerido'),
  apellido: z.string().min(1, 'Apellido requerido'),
  telefono: z.string().optional(),
  areaId: z.string().uuid().optional(),
  rolId: z.string().uuid().optional(),
})

const updateSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  telefono: z.string().optional(),
  areaId: z.string().uuid().nullable().optional(),
  estado: z.enum(['activo', 'inactivo', 'bloqueado']).optional(),
})

export async function usuariosRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authGuard)

  // GET /usuarios
  fastify.get('/', async (request, reply) => {
    const query = request.query as any
    const result = await UsuariosService.list({
      page: Number(query.page) || 1,
      perPage: Number(query.per_page) || 20,
      search: query.search,
      estado: query.estado,
      areaId: query.area_id,
    })
    return { success: true, ...result }
  })

  // GET usuarios/:id - Obtener usuario por ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as any
    const user = await UsuariosService.getById(id)
    return { success: true, data: user }
  })

  // POST usuarios - Crear nuevo usuario
  fastify.post('/', { preHandler: [adminGuard] }, async (request, reply) => {
    const body = createSchema.parse(request.body)
    const currentUser = request.user as any
    const user = await UsuariosService.create(body, currentUser.id)
    reply.status(201)
    return { success: true, data: user }
  })

  // PUT usuarios/:id - Actualizar usuario
  fastify.put('/:id', { preHandler: [adminGuard] }, async (request, reply) => {
    const { id } = request.params as any
    const body = updateSchema.parse(request.body)
    const currentUser = request.user as any
    const user = await UsuariosService.update(id, body, currentUser.id)
    return { success: true, data: user }
  })

  // DELETE usuarios/:id - Eliminar usuario
  fastify.delete('/:id', { preHandler: [adminGuard] }, async (request, reply) => {
    const { id } = request.params as any
    const currentUser = request.user as any
    const result = await UsuariosService.delete(id, currentUser.id)
    return { success: true, data: result }
  })
}

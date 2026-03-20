import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { clientesService } from '../services/clientes.service'
import { authGuard, adminGuard } from '../middleware/auth'

export async function clientesRoutes(fastify: FastifyInstance) {
  // GET /api/v1/clientes - Listar clientes con paginación y búsqueda
  fastify.get('/clientes', {
    preHandler: [authGuard],
    schema: {
      querystring: z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(10),
        search: z.string().optional(),
        estado: z.enum(['prospecto', 'activo', 'inactivo', 'potencial']).optional(),
      }),
    },
  }, async (request, reply) => {
    try {
      const { page, limit, search, estado } = request.query as any
      const result = await clientesService.getAllClientes(page, limit, search, estado)
      return result
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return { error: 'Error al obtener clientes' }
    }
  })

  // GET /api/v1/clientes/:id - Obtener cliente por ID
  fastify.get('/clientes/:id', {
    preHandler: [authGuard],
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const cliente = await clientesService.getClienteById(id)
      return cliente
    } catch (error) {
      fastify.log.error(error)
      if (error.message === 'Cliente no encontrado') {
        reply.code(404)
        return { error: 'Cliente no encontrado' }
      }
      reply.code(500)
      return { error: 'Error al obtener cliente' }
    }
  })

  // POST /api/v1/clientes - Crear cliente
  fastify.post('/clientes', {
    preHandler: [authGuard, adminGuard],
    schema: {
      body: z.object({
        ruc: z.string().min(11).max(20).optional(),
        razonSocial: z.string().min(2).max(200),
        nombreComercial: z.string().max(200).optional(),
        direccion: z.string().optional(),
        telefono: z.string().max(50).optional(),
        email: z.string().email().max(100).optional(),
        web: z.string().url().max(200).optional(),
        estado: z.enum(['prospecto', 'activo', 'inactivo', 'potencial']).default('prospecto').optional(),
        sector: z.string().max(50).optional(),
        actividad: z.string().max(100).optional(),
        descripcion: z.string().optional(),
        notas: z.string().optional(),
        areaId: z.string().uuid().optional(),
        responsableId: z.string().uuid().optional(),
      }),
    },
  }, async (request, reply) => {
    try {
      const cliente = await clientesService.createCliente(request.body as any)
      reply.code(201)
      return cliente
    } catch (error) {
      fastify.log.error(error)
      reply.code(400)
      return { error: 'Error al crear cliente', details: error.message }
    }
  })

  // PUT /api/v1/clientes/:id - Actualizar cliente
  fastify.put('/clientes/:id', {
    preHandler: [authGuard, adminGuard],
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
      body: z.object({
        ruc: z.string().min(11).max(20).optional(),
        razonSocial: z.string().min(2).max(200).optional(),
        nombreComercial: z.string().max(200).optional(),
        direccion: z.string().optional(),
        telefono: z.string().max(50).optional(),
        email: z.string().email().max(100).optional(),
        web: z.string().url().max(200).optional(),
        estado: z.enum(['prospecto', 'activo', 'inactivo', 'potencial']).optional(),
        sector: z.string().max(50).optional(),
        actividad: z.string().max(100).optional(),
        descripcion: z.string().optional(),
        notas: z.string().optional(),
        areaId: z.string().uuid().optional(),
        responsableId: z.string().uuid().optional(),
      }),
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const cliente = await clientesService.updateCliente(id, request.body as any)
      return cliente
    } catch (error) {
      fastify.log.error(error)
      if (error.message === 'Cliente no encontrado') {
        reply.code(404)
        return { error: 'Cliente no encontrado' }
      }
      reply.code(400)
      return { error: 'Error al actualizar cliente', details: error.message }
    }
  })

  // DELETE /api/v1/clientes/:id - Eliminar cliente
  fastify.delete('/clientes/:id', {
    preHandler: [authGuard, adminGuard],
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const cliente = await clientesService.deleteCliente(id)
      return cliente
    } catch (error) {
      fastify.log.error(error)
      if (error.message === 'Cliente no encontrado') {
        reply.code(404)
        return { error: 'Cliente no encontrado' }
      }
      reply.code(500)
      return { error: 'Error al eliminar cliente' }
    }
  })

  // GET /api/v1/clientes/options - Obtener opciones para select
  fastify.get('/clientes/options', {
    preHandler: [authGuard],
    schema: {
      querystring: z.object({
        search: z.string().optional(),
      }),
    },
  }, async (request, reply) => {
    try {
      const { search } = request.query as any
      const clientes = await clientesService.getClientesOptions(search)
      return clientes
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return { error: 'Error al obtener opciones de clientes' }
    }
  })

  // GET /api/v1/clientes/stats - Estadísticas de clientes
  fastify.get('/clientes/stats', {
    preHandler: [authGuard],
  }, async (request, reply) => {
    try {
      const stats = await clientesService.getClientesStats()
      return stats
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return { error: 'Error al obtener estadísticas de clientes' }
    }
  })

  // CONTACTOS ENDPOINTS
  // GET /api/v1/clientes/:id/contactos - Obtener contactos de un cliente
  fastify.get('/clientes/:id/contactos', {
    preHandler: [authGuard],
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const contactos = await clientesService.getContactosByCliente(id)
      return contactos
    } catch (error) {
      fastify.log.error(error)
      reply.code(500)
      return { error: 'Error al obtener contactos del cliente' }
    }
  })

  // POST /api/v1/clientes/:id/contactos - Crear contacto para un cliente
  fastify.post('/clientes/:id/contactos', {
    preHandler: [authGuard, adminGuard],
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
      body: z.object({
        nombre: z.string().min(2).max(200),
        apellido: z.string().max(100).optional(),
        cargo: z.string().max(100).optional(),
        tipo: z.enum(['principal', 'facturacion', 'tecnico', 'comercial']).default('principal').optional(),
        telefono: z.string().max(50).optional(),
        email: z.string().email().max(100).optional(),
        celular: z.string().max(50).optional(),
        direccion: z.string().optional(),
        notas: z.string().optional(),
        esPrincipal: z.boolean().default(false).optional(),
        activo: z.boolean().default(true).optional(),
      }),
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const contactoData = {
        ...request.body,
        clienteId: id,
      }
      const contacto = await clientesService.createContacto(contactoData)
      reply.code(201)
      return contacto
    } catch (error) {
      fastify.log.error(error)
      reply.code(400)
      return { error: 'Error al crear contacto', details: error.message }
    }
  })

  // PUT /api/v1/contactos/:id - Actualizar contacto
  fastify.put('/contactos/:id', {
    preHandler: [authGuard, adminGuard],
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
      body: z.object({
        nombre: z.string().min(2).max(200).optional(),
        apellido: z.string().max(100).optional(),
        cargo: z.string().max(100).optional(),
        tipo: z.enum(['principal', 'facturacion', 'tecnico', 'comercial']).optional(),
        telefono: z.string().max(50).optional(),
        email: z.string().email().max(100).optional(),
        celular: z.string().max(50).optional(),
        direccion: z.string().optional(),
        notas: z.string().optional(),
        esPrincipal: z.boolean().optional(),
        activo: z.boolean().optional(),
      }),
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const contacto = await clientesService.updateContacto(id, request.body)
      return contacto
    } catch (error) {
      fastify.log.error(error)
      if (error.message === 'Contacto no encontrado') {
        reply.code(404)
        return { error: 'Contacto no encontrado' }
      }
      reply.code(400)
      return { error: 'Error al actualizar contacto', details: error.message }
    }
  })

  // DELETE /api/v1/contactos/:id - Eliminar contacto
  fastify.delete('/contactos/:id', {
    preHandler: [authGuard, adminGuard],
    schema: {
      params: z.object({
        id: z.string().uuid(),
      }),
    },
  }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const contacto = await clientesService.deleteContacto(id)
      return contacto
    } catch (error) {
      fastify.log.error(error)
      if (error.message === 'Contacto no encontrado') {
        reply.code(404)
        return { error: 'Contacto no encontrado' }
      }
      reply.code(500)
      return { error: 'Error al eliminar contacto' }
    }
  })
}

import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { clientesService } from '../services/clientes.service'
import { authGuard, adminGuard } from '../middleware/auth'

export async function clientesRoutes(fastify: FastifyInstance) {
  // GET clientes - Listar clientes con paginación y búsqueda
  fastify.get('/', {
    preHandler: [authGuard],
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

  // GET clientes/:id - Obtener cliente por ID
  fastify.get('/:id', {
    preHandler: [authGuard],
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

  // POST clientes - Crear nuevo cliente
  fastify.post('/', {
    preHandler: [authGuard, adminGuard],
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

  // PUT clientes/:id - Actualizar cliente
  fastify.put('/:id', {
    preHandler: [authGuard, adminGuard],
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

  // DELETE clientes/:id - Eliminar cliente
  fastify.delete('/:id', {
    preHandler: [authGuard, adminGuard],
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

  // GET clientes/options - Obtener opciones para select
  fastify.get('/options', {
    preHandler: [authGuard],
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

  // GET clientes/stats - Estadísticas de clientes
  fastify.get('/stats', {
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
  // GET clientes/:id/contactos - Obtener contactos de un cliente
  fastify.get('/:id/contactos', {
    preHandler: [authGuard],
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

  // POST clientes/:id/contactos - Crear contacto para un cliente
  fastify.post('/:id/contactos', {
    preHandler: [authGuard, adminGuard],
  }, async (request, reply) => {
    try {
      const { id } = request.params as any
      const contactoData = {
        ...request.body,
        clienteId: id
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

  // PUT contactos/:id - Actualizar contacto
  fastify.put('/contactos/:id', {
    preHandler: [authGuard, adminGuard],
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

  // DELETE contactos/:id - Eliminar contacto
  fastify.delete('/contactos/:id', {
    preHandler: [authGuard, adminGuard],
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

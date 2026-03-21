import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function proyectosRoutes(fastify: FastifyInstance) {

  // Middleware de autenticación
  fastify.addHook('preHandler', async (request, reply) => {
    await request.jwtVerify()
    if (!request.user) {
      return reply.status(401).send({ error: 'No autorizado' })
    }
  })

  // GET /proyectos - Lista de proyectos
  fastify.get('/proyectos', async (request, reply) => {
    return {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
    }
  })

  // GET /proyectos/stats - Estadísticas
  fastify.get('/proyectos/stats', async (request, reply) => {
    return {
      total: 0,
      enProgreso: 0,
      cerrados: 0,
      presupuestoTotal: 0
    }
  })

  // GET /proyectos/options - Opciones
  fastify.get('/proyectos/options', async (request, reply) => {
    return {
      estados: [
        { value: 'propuesta', label: 'Propuesta' },
        { value: 'aprobado', label: 'Aprobado' },
        { value: 'iniciado', label: 'Iniciado' },
        { value: 'en_progreso', label: 'En Progreso' },
        { value: 'en_revision', label: 'En Revisión' },
        { value: 'cerrado', label: 'Cerrado' },
        { value: 'pausado', label: 'Pausado' },
        { value: 'cancelado', label: 'Cancelado' }
      ],
      prioridades: [
        { value: 'baja', label: 'Baja' },
        { value: 'media', label: 'Media' },
        { value: 'alta', label: 'Alta' },
        { value: 'critica', label: 'Crítica' }
      ]
    }
  })

  // GET /proyectos/:id - Obtener proyecto por ID
  fastify.get('/proyectos/:id', async (request, reply) => {
    return { error: 'Proyecto no encontrado' }
  })

  // POST /proyectos - Crear proyecto
  fastify.post('/proyectos', async (request, reply) => {
    return { error: 'No implementado' }
  })

  // PUT /proyectos/:id - Actualizar proyecto
  fastify.put('/proyectos/:id', async (request, reply) => {
    return { error: 'No implementado' }
  })

  // DELETE /proyectos/:id - Eliminar proyecto
  fastify.delete('/proyectos/:id', async (request, reply) => {
    return { error: 'No implementado' }
  })
}

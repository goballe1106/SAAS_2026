import { FastifyInstance } from 'fastify'
import { ProyectosService, createProyectoSchema, updateProyectoSchema } from '../services/proyectos.service'
import { z } from 'zod'

export async function proyectosRoutes(fastify: FastifyInstance) {
  const proyectosService = new ProyectosService()

  // Middleware de autenticación para todas las rutas
  fastify.addHook('preHandler', async (request, reply) => {
    if (!request.user) {
      return reply.status(401).send({ error: 'No autorizado' })
    }
  })

  // ============================================================
  // PROYECTOS
  // ============================================================

  // GET /api/v1/proyectos
  fastify.get('/proyectos', async (request, reply) => {
    try {
      const { page = 1, limit = 10, search, estado, areaId, responsableId } = request.query as any
      
      const result = await proyectosService.getProyectos(
        Number(page),
        Number(limit),
        search,
        estado,
        areaId,
        responsableId
      )
      
      return reply.send(result)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al obtener proyectos' })
    }
  })

  // GET /api/v1/proyectos/stats
  fastify.get('/proyectos/stats', async (request, reply) => {
    try {
      const stats = await proyectosService.getProyectosStats()
      return reply.send(stats)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al obtener estadísticas de proyectos' })
    }
  })

  // GET /api/v1/proyectos/options
  fastify.get('/proyectos/options', async (request, reply) => {
    try {
      const { search } = request.query as any
      const proyectos = await proyectosService.getProyectosOptions(search)
      return reply.send(proyectos)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al obtener opciones de proyectos' })
    }
  })

  // GET /api/v1/proyectos/:id
  fastify.get('/proyectos/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      const proyecto = await proyectosService.getProyectoById(id)
      
      if (!proyecto) {
        return reply.status(404).send({ error: 'Proyecto no encontrado' })
      }
      
      return reply.send(proyecto)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al obtener proyecto' })
    }
  })

  // POST /api/v1/proyectos
  fastify.post('/proyectos', async (request, reply) => {
    try {
      const validatedData = createProyectoSchema.parse(request.body)
      const proyecto = await proyectosService.createProyecto(validatedData)
      
      return reply.status(201).send(proyecto)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Datos inválidos', 
          details: error.errors 
        })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al crear proyecto' })
    }
  })

  // PUT /api/v1/proyectos/:id
  fastify.put('/proyectos/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      const validatedData = updateProyectoSchema.parse(request.body)
      
      const proyecto = await proyectosService.updateProyecto(id, validatedData)
      
      if (!proyecto) {
        return reply.status(404).send({ error: 'Proyecto no encontrado' })
      }
      
      return reply.send(proyecto)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Datos inválidos', 
          details: error.errors 
        })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al actualizar proyecto' })
    }
  })

  // DELETE /api/v1/proyectos/:id
  fastify.delete('/proyectos/:id', async (request, reply) => {
    try {
      const { id } = request.params as any
      
      // Verificar si el usuario tiene permisos de admin
      if (request.user.rol !== 'admin') {
        return reply.status(403).send({ error: 'No tiene permisos para eliminar proyectos' })
      }
      
      const proyecto = await proyectosService.deleteProyecto(id)
      
      if (!proyecto) {
        return reply.status(404).send({ error: 'Proyecto no encontrado' })
      }
      
      return reply.send(proyecto)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al eliminar proyecto' })
    }
  })

  // ============================================================
  // CENTROS DE COSTO
  // ============================================================

  // GET /api/v1/centros-costo
  fastify.get('/centros-costo', async (request, reply) => {
    try {
      const { areaId } = request.query as any
      const centrosCosto = await proyectosService.getCentrosCosto(areaId)
      return reply.send(centrosCosto)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al obtener centros de costo' })
    }
  })

  // POST /api/v1/centros-costo
  fastify.post('/centros-costo', async (request, reply) => {
    try {
      const validatedData = createProyectoSchema.parse(request.body)
      const centroCosto = await proyectosService.createCentroCosto(validatedData)
      
      return reply.status(201).send(centroCosto)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Datos inválidos', 
          details: error.errors 
        })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al crear centro de costo' })
    }
  })

  // ============================================================
  // HITOS
  // ============================================================

  // GET /api/v1/proyectos/:id/hitos
  fastify.get('/proyectos/:id/hitos', async (request, reply) => {
    try {
      const { id } = request.params as any
      const hitos = await proyectosService.getHitosByProyecto(id)
      return reply.send(hitos)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al obtener hitos del proyecto' })
    }
  })

  // POST /api/v1/proyectos/:id/hitos
  fastify.post('/proyectos/:id/hitos', async (request, reply) => {
    try {
      const { id } = request.params as any
      const hitoData = {
        ...request.body,
        proyectoId: id
      }
      
      const validatedData = createProyectoSchema.parse(hitoData)
      const hito = await proyectosService.createHito(validatedData)
      
      return reply.status(201).send(hito)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Datos inválidos', 
          details: error.errors 
        })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al crear hito' })
    }
  })

  // ============================================================
  // RECURSOS
  // ============================================================

  // GET /api/v1/proyectos/:id/recursos
  fastify.get('/proyectos/:id/recursos', async (request, reply) => {
    try {
      const { id } = request.params as any
      const recursos = await proyectosService.getRecursosByProyecto(id)
      return reply.send(recursos)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al obtener recursos del proyecto' })
    }
  })

  // POST /api/v1/proyectos/:id/recursos
  fastify.post('/proyectos/:id/recursos', async (request, reply) => {
    try {
      const { id } = request.params as any
      const recursoData = {
        ...request.body,
        proyectoId: id
      }
      
      const validatedData = createProyectoSchema.parse(recursoData)
      const recurso = await proyectosService.createRecurso(validatedData)
      
      return reply.status(201).send(recurso)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Datos inválidos', 
          details: error.errors 
        })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al asignar recurso' })
    }
  })

  // ============================================================
  // DOCUMENTOS
  // ============================================================

  // GET /api/v1/proyectos/:id/documentos
  fastify.get('/proyectos/:id/documentos', async (request, reply) => {
    try {
      const { id } = request.params as any
      const { tipo } = request.query as any
      const documentos = await proyectosService.getDocumentosByProyecto(id, tipo)
      return reply.send(documentos)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al obtener documentos del proyecto' })
    }
  })

  // POST /api/v1/proyectos/:id/documentos
  fastify.post('/proyectos/:id/documentos', async (request, reply) => {
    try {
      const { id } = request.params as any
      const documentoData = {
        ...request.body,
        proyectoId: id,
        subidoPor: request.user.id
      }
      
      const validatedData = createProyectoSchema.parse(documentoData)
      const documento = await proyectosService.createDocumento(validatedData)
      
      return reply.status(201).send(documento)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Datos inválidos', 
          details: error.errors 
        })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al subir documento' })
    }
  })

  // ============================================================
  // SEGUIMIENTO
  // ============================================================

  // GET /api/v1/proyectos/:id/seguimiento
  fastify.get('/proyectos/:id/seguimiento', async (request, reply) => {
    try {
      const { id } = request.params as any
      const { tipo } = request.query as any
      const seguimiento = await proyectosService.getSeguimientoByProyecto(id, tipo)
      return reply.send(seguimiento)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al obtener seguimiento del proyecto' })
    }
  })

  // POST /api/v1/proyectos/:id/seguimiento
  fastify.post('/proyectos/:id/seguimiento', async (request, reply) => {
    try {
      const { id } = request.params as any
      const seguimientoData = {
        ...request.body,
        proyectoId: id,
        reportadoPor: request.user.id
      }
      
      const validatedData = createProyectoSchema.parse(seguimientoData)
      const seguimiento = await proyectosService.createSeguimiento(validatedData)
      
      return reply.status(201).send(seguimiento)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ 
          error: 'Datos inválidos', 
          details: error.errors 
        })
      }
      
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Error al crear seguimiento' })
    }
  })
}

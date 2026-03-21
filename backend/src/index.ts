import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { errorHandler } from './middleware/error'
import { authRoutes } from './routes/auth'
import { usuariosRoutes } from './routes/usuarios'
import { areasRoutes } from './routes/areas'
import { rolesRoutes } from './routes/roles'
import { dashboardRoutes } from './routes/dashboard'
import { clientesRoutes } from './routes/clientes'
import { proyectosRoutes } from './routes/proyectos'
import { aiRoutes } from './routes/ai'

const PORT = Number(process.env.API_PORT || process.env.PORT || 3001)
const HOST = '0.0.0.0'

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    },
    trustProxy: true,
  })

  // Error handler
  fastify.setErrorHandler(errorHandler)

  // Zod validation error handler
  fastify.addHook('onError', async (request, reply, error: any) => {
    if (error.name === 'ZodError') {
      reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos de entrada inválidos',
          details: error.errors,
        },
      })
    }
  })

  // CORS
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:9000',
    'http://192.168.1.43:9000',
    process.env.APP_URL,
  ].filter(Boolean) as string[]

  await fastify.register(cors, {
    origin: true,
    credentials: true,
  })

  // Helmet
  await fastify.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })

  // JWT
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'default-dev-secret-change-me',
  })

  // Rate limit
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  // Swagger docs
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'ERP SAS API',
        description: 'Sistema de Gestión Empresarial - API REST',
        version: '1.0.0',
      },
      servers: [{ url: `http://localhost:${PORT}` }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  })

  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }))

  // API Routes
  await fastify.register(authRoutes, { prefix: '/api/v1/auth' })
  await fastify.register(usuariosRoutes, { prefix: '/api/v1/usuarios' })
  await fastify.register(clientesRoutes, { prefix: '/api/v1/clientes' })
  await fastify.register(proyectosRoutes, { prefix: '/api/v1' })
  await fastify.register(rolesRoutes, { prefix: '/api/v1/roles' })
  await fastify.register(dashboardRoutes, { prefix: '/api/v1/dashboard' })
  await fastify.register(areasRoutes, { prefix: '/api/v1/areas' })
  await fastify.register(aiRoutes, { prefix: '/api/v1/ai' })

  return fastify
}

async function start() {
  try {
    const fastify = await buildServer()

    await fastify.listen({ port: PORT, host: HOST })

    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🏢 ERP SAS API - Servidor iniciado                         ║
║                                                               ║
║   📍 URL: http://${HOST}:${PORT}                              ║
║   📖 Docs: http://localhost:${PORT}/docs                      ║
║   🔧 Entorno: ${process.env.NODE_ENV || 'development'}       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `)
  } catch (err) {
    console.error('❌ Error starting server:', err)
    process.exit(1)
  }
}

start()

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import 'dotenv/config';
import { authRoutes } from './routes/auth';
import { usuariosRoutes } from './routes/usuarios';
import { areasRoutes } from './routes/areas';
import { rolesRoutes } from './routes/roles';
import { dashboardRoutes } from './routes/dashboard';
import { errorHandler } from './middleware/error';
import { authMiddleware } from './middleware/auth';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

async function start() {
  // Helmet
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
      },
    },
  });

  // CORS
  await fastify.register(cors, {
    origin: [
      'http://localhost:5173',
      'http://192.168.1.43:5173',
      process.env.APP_URL || '',
    ].filter(Boolean),
    credentials: true,
  });

  // Rate Limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
      },
    }),
  });

  // Swagger
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'ERP SAS API',
        description: 'API REST para el Sistema de Gestión Empresarial ERP SAS',
        version: '1.0.0',
      },
      servers: [
        {
          url: process.env.API_URL || 'http://localhost:3001',
          description: 'Development server',
        },
      ],
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
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });

  // Health check
  fastify.get('/health', async () => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // Rutas públicas
  fastify.register(authRoutes, { prefix: '/api/v1/auth' });

  // Rutas protegidas
  fastify.register(async function (fastify) {
    fastify.addHook('onRequest', async (request, reply) => {
      await authMiddleware(request, reply);
    });

    fastify.register(usuariosRoutes, { prefix: '/api/v1/usuarios' });
    fastify.register(areasRoutes, { prefix: '/api/v1/areas' });
    fastify.register(rolesRoutes, { prefix: '/api/v1/roles' });
    fastify.register(dashboardRoutes, { prefix: '/api/v1/dashboard' });
  });

  // Manejo de errores
  fastify.setErrorHandler(errorHandler);

  // Iniciar servidor
  const port = parseInt(process.env.API_PORT || '3001');
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '0.0.0.0';
  
  await fastify.listen({ port, host });
  
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🏢 ERP SAS API - Servidor iniciado                         ║
║                                                               ║
║   📍 URL: http://localhost:${port}                              ║
║   📖 Docs: http://localhost:${port}/docs                       ║
║   🔧 Entorno: ${process.env.NODE_ENV || 'development'}                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
}

start().catch((err) => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});

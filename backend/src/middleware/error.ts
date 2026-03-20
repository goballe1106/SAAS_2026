import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  const statusCode = (error as any).statusCode || error.statusCode || 500
  const message = error.message || 'Error interno del servidor'

  request.log.error({ err: error, url: request.url, method: request.method })

  reply.status(statusCode).send({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  })
}

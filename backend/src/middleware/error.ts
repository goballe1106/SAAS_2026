import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  request.log.error(error);
  if (error.validation) {
    return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Error de validación', details: error.validation } });
  }
  const statusCode = error.statusCode || 500;
  return reply.status(statusCode).send({ success: false, error: { code: error.code || 'INTERNAL_ERROR', message: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : error.message } });
}

import { FastifyRequest, FastifyReply } from 'fastify';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const publicPaths = ['/health', '/docs', '/docs/', '/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh'];
  const isPublicPath = publicPaths.some(path => request.url.startsWith(path));
  if (isPublicPath) return;

  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'No se proporcionó token' } });
    }
  } catch (error) {
    return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Token inválido' } });
  }
}

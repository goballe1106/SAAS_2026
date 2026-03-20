import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { authService } from '../services/auth.service';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const registerSchema = z.object({ email: z.string().email(), password: z.string().min(6), nombreCompleto: z.string().min(3) });

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);
      const ipAddress = request.ip;
      const userAgent = request.headers['user-agent'];
      const result = await authService.login(body, ipAddress, userAgent);
      if (!result.success) {
        return reply.status(401).send({ success: false, error: { code: 'LOGIN_FAILED', message: result.message } });
      }
      return reply.send({ success: true, data: { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken } });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', details: error.errors } });
      }
      throw error;
    }
  });

  fastify.post('/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);
      const result = await authService.register(body);
      if (!result.success) {
        return reply.status(400).send({ success: false, error: { code: 'REGISTER_FAILED', message: result.message } });
      }
      return reply.status(201).send({ success: true, data: result.user });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', details: error.errors } });
      }
      throw error;
    }
  });

  fastify.get('/me', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED' } });
      const token = authHeader.substring(7);
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());
      const user = await authService.getCurrentUser(payload.userId);
      if (!user) return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND' } });
      return reply.send({ success: true, data: user });
    } catch (error) { throw error; }
  });

  fastify.post('/logout', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED' } });
      const token = authHeader.substring(7);
      await authService.logout(token);
      return reply.send({ success: true, message: 'Sesión cerrada correctamente' });
    } catch (error) { throw error; }
  });
}

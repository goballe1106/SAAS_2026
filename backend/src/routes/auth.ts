import { FastifyInstance } from 'fastify'
import { AuthService } from '../services/auth.service'
import { authGuard } from '../middleware/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Password requerido'),
})

export async function authRoutes(fastify: FastifyInstance) {
  // POST auth/login
  fastify.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body)

    const { user, tokenPayload } = await AuthService.login({
      email: body.email,
      password: body.password,
      userAgent: request.headers['user-agent'],
      ipAddress: request.ip,
    })

    const accessToken = fastify.jwt.sign(tokenPayload, { expiresIn: '15m' })
    const refreshToken = fastify.jwt.sign({ id: user.id, type: 'refresh' }, { expiresIn: '7d' })

    await AuthService.saveRefreshToken(
      user.id,
      refreshToken,
      request.headers['user-agent'],
      request.ip,
    )

    return {
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    }
  })

  // POST auth/refresh
  fastify.post('/refresh', async (request, reply) => {
    const { refreshToken } = request.body as any

    if (!refreshToken) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Refresh token requerido' },
      })
    }

    try {
      const decoded = fastify.jwt.verify(refreshToken) as any
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type')
      }

      const user = await AuthService.validateRefreshToken(refreshToken)
      if (!user) {
        return reply.status(401).send({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Refresh token inválido o expirado' },
        })
      }

      const me = await AuthService.getMe(user.id)
      const newAccessToken = fastify.jwt.sign(
        {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          roles: me.roles.map((r: any) => r.rol),
        },
        { expiresIn: '15m' },
      )

      return { success: true, data: { accessToken: newAccessToken } }
    } catch {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Refresh token inválido' },
      })
    }
  })

  // POST auth/logout
  fastify.post('/logout', { preHandler: [authGuard] }, async (request, reply) => {
    const user = request.user as any
    const { refreshToken } = request.body as any
    if (refreshToken) {
      await AuthService.logout(user.id, refreshToken)
    }
    return { success: true, data: { message: 'Sesión cerrada' } }
  })

  // GET auth/me
  fastify.get('/me', { preHandler: [authGuard] }, async (request, reply) => {
    const user = request.user as any
    const me = await AuthService.getMe(user.id)
    return { success: true, data: me }
  })
}

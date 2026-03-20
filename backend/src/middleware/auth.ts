import { FastifyRequest, FastifyReply } from 'fastify'

export async function authGuard(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(401).send({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token inválido o expirado' },
    })
  }
}

export async function adminGuard(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
    const user = request.user as any
    if (!user.roles || !user.roles.includes('Administrador')) {
      reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Se requiere rol de Administrador' },
      })
    }
  } catch (err) {
    reply.status(401).send({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token inválido o expirado' },
    })
  }
}

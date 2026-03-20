import { eq, and } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../config/database'
import { usuarios, usuariosRoles, roles, tokenesSesion, auditoriaLogs } from '../drizzle/schema'

interface LoginInput {
  email: string
  password: string
  userAgent?: string
  ipAddress?: string
}

interface TokenPayload {
  id: string
  email: string
  nombre: string
  apellido: string
  roles: string[]
}

export class AuthService {
  static async login(input: LoginInput) {
    const user = await db.query.usuarios.findFirst({
      where: eq(usuarios.email, input.email),
      with: {
        usuariosRoles: {
          with: { rol: true },
        },
      },
    })

    if (!user) {
      throw { statusCode: 401, message: 'Credenciales inválidas' }
    }

    if (user.estado !== 'activo') {
      throw { statusCode: 403, message: 'Usuario inactivo o bloqueado' }
    }

    const validPassword = await bcrypt.compare(input.password, user.password)
    if (!validPassword) {
      throw { statusCode: 401, message: 'Credenciales inválidas' }
    }

    // Update ultimo login
    await db.update(usuarios)
      .set({ ultimoLogin: new Date() })
      .where(eq(usuarios.id, user.id))

    // Audit log
    await db.insert(auditoriaLogs).values({
      usuarioId: user.id,
      accion: 'LOGIN',
      modulo: 'auth',
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    })

    const userRoles = user.usuariosRoles.map((ur: any) => ur.rol.nombre)

    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      roles: userRoles,
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        avatar: user.avatar,
        estado: user.estado,
        roles: userRoles,
      },
      tokenPayload,
    }
  }

  static async saveRefreshToken(
    usuarioId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await db.insert(tokenesSesion).values({
      usuarioId,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt,
    })
  }

  static async logout(usuarioId: string, refreshToken: string) {
    await db.delete(tokenesSesion)
      .where(
        and(
          eq(tokenesSesion.usuarioId, usuarioId),
          eq(tokenesSesion.refreshToken, refreshToken),
        )
      )

    await db.insert(auditoriaLogs).values({
      usuarioId,
      accion: 'LOGOUT',
      modulo: 'auth',
    })
  }

  static async getMe(userId: string) {
    const user = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, userId),
      with: {
        area: true,
        usuariosRoles: {
          with: { rol: true, area: true },
        },
      },
    })

    if (!user) {
      throw { statusCode: 404, message: 'Usuario no encontrado' }
    }

    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
      avatar: user.avatar,
      estado: user.estado,
      area: user.area,
      roles: user.usuariosRoles.map((ur: any) => ({
        rol: ur.rol.nombre,
        nivel: ur.rol.nivel,
        area: ur.area?.nombre || null,
      })),
      ultimoLogin: user.ultimoLogin,
      createdAt: user.createdAt,
    }
  }

  static async validateRefreshToken(token: string) {
    const session = await db.query.tokenesSesion.findFirst({
      where: eq(tokenesSesion.refreshToken, token),
      with: { usuario: true },
    })

    if (!session || session.expiresAt < new Date()) {
      return null
    }

    return session.usuario
  }
}

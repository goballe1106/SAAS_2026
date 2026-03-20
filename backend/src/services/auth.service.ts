import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { usuarios, tokensSesion } from '../drizzle/schema/index.js';
import { eq, and } from 'drizzle-orm';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombreCompleto: string;
  telefono?: string;
  areaId?: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResult> {
    try {
      const existingUser = await db.select()
        .from(usuarios)
        .where(eq(usuarios.email, data.email))
        .limit(1);

      if (existingUser.length > 0) {
        return { success: false, message: 'El correo electrónico ya está registrado' };
      }

      const passwordHash = await bcrypt.hash(data.password, 12);

      const nuevoUsuario: any = {
        email: data.email,
        passwordHash,
        nombreCompleto: data.nombreCompleto,
        telefono: data.telefono || null,
        areaId: data.areaId || null,
        rol: 'empleado',
        activo: true,
        idioma: 'es',
        zonaHoraria: 'America/Lima',
      };

      const result = await db.insert(usuarios).values(nuevoUsuario).returning();

      return {
        success: true,
        user: {
          id: result[0].id,
          email: result[0].email,
          nombreCompleto: result[0].nombreCompleto,
          rol: result[0].rol,
        },
      };
    } catch (error: any) {
      console.error('Error en register:', error);
      return { success: false, message: 'Error al registrar usuario' };
    }
  }

  async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<AuthResult> {
    try {
      const users = await db.select()
        .from(usuarios)
        .where(and(eq(usuarios.email, credentials.email), eq(usuarios.activo, true)))
        .limit(1);

      if (users.length === 0) {
        return { success: false, message: 'Credenciales inválidas' };
      }

      const user = users[0];

      if (user.bloqueadoHasta && new Date(user.bloqueadoHasta) > new Date()) {
        return { success: false, message: `Cuenta bloqueada hasta ${new Date(user.bloqueadoHasta).toLocaleString()}` };
      }

      const validPassword = await bcrypt.compare(credentials.password, user.passwordHash);

      if (!validPassword) {
        await db.update(usuarios)
          .set({
            intentosLogin: (user.intentosLogin || 0) + 1,
            bloqueadoHasta: (user.intentosLogin || 0) >= 4 ? new Date(Date.now() + 30 * 60 * 1000) : null,
          })
          .where(eq(usuarios.id, user.id));

        return { success: false, message: 'Credenciales inválidas' };
      }

      const accessToken = this.generateToken(user.id, 'access');
      const refreshToken = this.generateToken(user.id, 'refresh');

      await db.insert(tokensSesion).values({
        usuarioId: user.id,
        token: accessToken,
        tipo: 'access',
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      await db.update(usuarios)
        .set({ ultimoLogin: new Date(), intentosLogin: 0, bloqueadoHasta: null })
        .where(eq(usuarios.id, user.id));

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nombreCompleto: user.nombreCompleto,
          rol: user.rol,
          fotoUrl: user.fotoUrl,
        },
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error al iniciar sesión' };
    }
  }

  async logout(token: string): Promise<boolean> {
    try {
      await db.update(tokensSesion).set({ revokedAt: new Date() }).where(eq(tokensSesion.token, token));
      return true;
    } catch (error) {
      console.error('Error en logout:', error);
      return false;
    }
  }

  private generateToken(userId: string, type: 'access' | 'refresh'): string {
    const payload = { userId, type, jti: uuidv4(), iat: Date.now() };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  async getCurrentUser(userId: string) {
    try {
      const users = await db.select().from(usuarios).where(eq(usuarios.id, userId)).limit(1);
      if (users.length === 0) return null;
      const user = users[0];
      return {
        id: user.id,
        email: user.email,
        nombreCompleto: user.nombreCompleto,
        telefono: user.telefono,
        whatsapp: user.whatsapp,
        telegram: user.telegram,
        fotoUrl: user.fotoUrl,
        rol: user.rol,
        areaId: user.areaId,
        activo: user.activo,
        idioma: user.idioma,
        zonaHoraria: user.zonaHoraria,
        ultimoLogin: user.ultimoLogin,
        createdAt: user.createdAt,
      };
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      return null;
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResult> {
    try {
      const users = await db.select().from(usuarios).where(eq(usuarios.id, userId)).limit(1);
      if (users.length === 0) return { success: false, message: 'Usuario no encontrado' };
      const user = users[0];
      const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!validPassword) return { success: false, message: 'Contraseña actual incorrecta' };
      const newPasswordHash = await bcrypt.hash(newPassword, 12);
      await db.update(usuarios).set({ passwordHash: newPasswordHash, debeCambiarPassword: false, updatedAt: new Date() }).where(eq(usuarios.id, userId));
      return { success: true, message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      console.error('Error en changePassword:', error);
      return { success: false, message: 'Error al cambiar contraseña' };
    }
  }
}

export const authService = new AuthService();

import bcrypt from 'bcrypt';
import { db } from '../config/database.js';
import { usuarios, areas } from '../drizzle/schema/index.js';
import { eq, and, or, like, asc, desc, sql } from 'drizzle-orm';

class UsuariosService {
  async findAll(filters: any = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const conditions: any[] = [];
    if (filters.search) {
      conditions.push(or(like(usuarios.nombreCompleto, `%${filters.search}%`), like(usuarios.email, `%${filters.search}%`)));
    }
    if (filters.rol) conditions.push(eq(usuarios.rol, filters.rol));
    if (filters.areaId) conditions.push(eq(usuarios.areaId, filters.areaId));
    if (filters.activo !== undefined) conditions.push(eq(usuarios.activo, filters.activo));

    const totalResult = await db.select({ id: usuarios.id }).from(usuarios).where(conditions.length > 0 ? and(...conditions) : undefined);
    const total = totalResult.length;

    const users = await db.select()
      .from(usuarios)
      .leftJoin(areas, eq(usuarios.areaId, areas.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset);

    const data = users.map((u: any) => ({
      id: u.usuarios.id,
      email: u.usuarios.email,
      nombreCompleto: u.usuarios.nombreCompleto,
      telefono: u.usuarios.telefono,
      rol: u.usuarios.rol,
      areaId: u.usuarios.areaId,
      areaNombre: u.areas?.nombre,
      activo: u.usuarios.activo,
      createdAt: u.usuarios.createdAt,
    }));

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const result = await db.select().from(usuarios).leftJoin(areas, eq(usuarios.areaId, areas.id)).where(eq(usuarios.id, id)).limit(1);
    if (result.length === 0) return null;
    const u = result[0];
    return {
      id: u.usuarios.id, email: u.usuarios.email, nombreCompleto: u.usuarios.nombreCompleto,
      telefono: u.usuarios.telefono, rol: u.usuarios.rol, areaId: u.usuarios.areaId,
      areaNombre: u.areas?.nombre, activo: u.usuarios.activo, createdAt: u.usuarios.createdAt,
    };
  }

  async create(data: any) {
    const existing = await db.select().from(usuarios).where(eq(usuarios.email, data.email)).limit(1);
    if (existing.length > 0) throw new Error('El correo electrónico ya está registrado');
    const passwordHash = await bcrypt.hash(data.password, 12);
    const nuevoUsuario: any = {
      email: data.email, passwordHash, nombreCompleto: data.nombreCompleto,
      telefono: data.telefono || null, rol: data.rol || 'empleado',
      areaId: data.areaId || null, activo: data.activo !== undefined ? data.activo : true,
      idioma: 'es', zonaHoraria: 'America/Lima',
    };
    const result = await db.insert(usuarios).values(nuevoUsuario).returning();
    return this.findById(result[0].id);
  }

  async update(id: string, data: any) {
    const updateData: any = { ...data, updatedAt: new Date() };
    delete updateData.password;
    await db.update(usuarios).set(updateData).where(eq(usuarios.id, id));
    return this.findById(id);
  }

  async delete(id: string) {
    await db.update(usuarios).set({ activo: false, deletedAt: new Date(), updatedAt: new Date() }).where(eq(usuarios.id, id));
    return { success: true };
  }
}

export const usuariosService = new UsuariosService();

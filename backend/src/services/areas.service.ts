import { db } from '../config/database.js';
import { areas, usuarios } from '../drizzle/schema/index.js';
import { eq, asc } from 'drizzle-orm';

class AreasService {
  async findAll(includeInactive = false) {
    const condition = includeInactive ? undefined : eq(areas.activo, true);
    const result = await db.select().from(areas).where(condition).orderBy(asc(areas.nombre));
    return result;
  }

  async findTree() {
    const allAreas = await this.findAll(true);
    const areaMap = new Map();
    const rootAreas: any[] = [];
    allAreas.forEach((area: any) => areaMap.set(area.id, { ...area, hijos: [] }));
    allAreas.forEach((area: any) => {
      const areaNode = areaMap.get(area.id);
      if (area.padreId) {
        const padre = areaMap.get(area.padreId);
        if (padre) padre.hijos.push(areaNode);
      } else {
        rootAreas.push(areaNode);
      }
    });
    return rootAreas;
  }

  async findById(id: string) {
    const result = await db.select().from(areas).where(eq(areas.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  }

  async create(data: any) {
    const existing = await db.select().from(areas).where(eq(areas.codigo, data.codigo)).limit(1);
    if (existing.length > 0) throw new Error('El código del área ya existe');
    const result = await db.insert(areas).values(data).returning();
    return this.findById(result[0].id);
  }

  async update(id: string, data: any) {
    const updateData: any = { ...data, updatedAt: new Date() };
    await db.update(areas).set(updateData).where(eq(areas.id, id));
    return this.findById(id);
  }

  async delete(id: string) {
    const children = await db.select().from(areas).where(eq(areas.padreId, id)).limit(1);
    if (children.length > 0) throw new Error('No se puede eliminar un área que tiene sub-áreas');
    await db.update(areas).set({ activo: false, updatedAt: new Date() }).where(eq(areas.id, id));
    return { success: true };
  }

  async findOptions() {
    return db.select({ id: areas.id, nombre: areas.nombre, codigo: areas.codigo, tipo: areas.tipo })
      .from(areas).where(eq(areas.activo, true)).orderBy(asc(areas.nombre));
  }
}

export const areasService = new AreasService();

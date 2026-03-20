import { db } from '../config/database'
import { clientes, contactos, oportunidades, actividades, cotizaciones, usuarios, areas } from '../drizzle/schema'
import { eq, and, like, or, desc, asc, ilike } from 'drizzle-orm'
import { z } from 'zod'

// Validation schemas
const createClienteSchema = z.object({
  ruc: z.string().min(11).max(20).optional(),
  razonSocial: z.string().min(2).max(200),
  nombreComercial: z.string().max(200).optional(),
  direccion: z.string().optional(),
  telefono: z.string().max(50).optional(),
  email: z.string().email().max(100).optional(),
  web: z.string().url().max(200).optional(),
  estado: z.enum(['prospecto', 'activo', 'inactivo', 'potencial']).default('prospecto'),
  sector: z.string().max(50).optional(),
  actividad: z.string().max(100).optional(),
  descripcion: z.string().optional(),
  notas: z.string().optional(),
  areaId: z.string().uuid().optional(),
  responsableId: z.string().uuid().optional(),
})

const updateClienteSchema = createClienteSchema.partial()

const createContactoSchema = z.object({
  clienteId: z.string().uuid(),
  nombre: z.string().min(2).max(200),
  apellido: z.string().max(100).optional(),
  cargo: z.string().max(100).optional(),
  tipo: z.enum(['principal', 'facturacion', 'tecnico', 'comercial']).default('principal'),
  telefono: z.string().max(50).optional(),
  email: z.string().email().max(100).optional(),
  celular: z.string().max(50).optional(),
  direccion: z.string().optional(),
  notas: z.string().optional(),
  esPrincipal: z.boolean().default(false),
  activo: z.boolean().default(true),
})

export type CreateClienteInput = z.infer<typeof createClienteSchema>
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>
export type CreateContactoInput = z.infer<typeof createContactoSchema>

export class ClientesService {
  // CLIENTES CRUD
  async getAllClientes(page = 1, limit = 10, search?: string, estado?: string) {
    const offset = (page - 1) * limit
    
    let whereCondition = undefined
    if (search) {
      whereCondition = or(
        like(clientes.razonSocial, `%${search}%`),
        like(clientes.nombreComercial, `%${search}%`),
        like(clientes.ruc, `%${search}%`),
        ilike(clientes.email, `%${search}%`)
      )
    }
    
    if (estado) {
      const estadoCondition = eq(clientes.estado, estado)
      whereCondition = whereCondition ? and(whereCondition, estadoCondition) : estadoCondition
    }

    const [clientesData, totalCount] = await Promise.all([
      db
        .select({
          id: clientes.id,
          ruc: clientes.ruc,
          razonSocial: clientes.razonSocial,
          nombreComercial: clientes.nombreComercial,
          telefono: clientes.telefono,
          email: clientes.email,
          web: clientes.web,
          estado: clientes.estado,
          sector: clientes.sector,
          actividad: clientes.actividad,
          createdAt: clientes.createdAt,
          updatedAt: clientes.updatedAt,
          area: {
            id: areas.id,
            nombre: areas.nombre,
          },
          responsable: {
            id: usuarios.id,
            nombre: usuarios.nombre,
            apellido: usuarios.apellido,
            email: usuarios.email,
          },
        })
        .from(clientes)
        .leftJoin(areas, eq(clientes.areaId, areas.id))
        .leftJoin(usuarios, eq(clientes.responsableId, usuarios.id))
        .where(whereCondition)
        .orderBy(desc(clientes.createdAt))
        .limit(limit)
        .offset(offset),
      
      db
        .select({ count: clientes.id })
        .from(clientes)
        .where(whereCondition)
    ])

    return {
      data: clientesData,
      pagination: {
        page,
        limit,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil(Number(totalCount[0]?.count || 0) / limit),
      },
    }
  }

  async getClienteById(id: string) {
    const [cliente] = await db
      .select({
        id: clientes.id,
        ruc: clientes.ruc,
        razonSocial: clientes.razonSocial,
        nombreComercial: clientes.nombreComercial,
        direccion: clientes.direccion,
        telefono: clientes.telefono,
        email: clientes.email,
        web: clientes.web,
        estado: clientes.estado,
        sector: clientes.sector,
        actividad: clientes.actividad,
        descripcion: clientes.descripcion,
        notas: clientes.notas,
        createdAt: clientes.createdAt,
        updatedAt: clientes.updatedAt,
        area: {
          id: areas.id,
          nombre: areas.nombre,
        },
        responsable: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          apellido: usuarios.apellido,
          email: usuarios.email,
        },
      })
      .from(clientes)
      .leftJoin(areas, eq(clientes.areaId, areas.id))
      .leftJoin(usuarios, eq(clientes.responsableId, usuarios.id))
      .where(eq(clientes.id, id))
      .limit(1)

    if (!cliente) {
      throw new Error('Cliente no encontrado')
    }

    // Get related data
    const [contactosList, oportunidadesList, cotizacionesList] = await Promise.all([
      db
        .select()
        .from(contactos)
        .where(eq(contactos.clienteId, id))
        .orderBy(contactos.esPrincipal ? desc(1) : asc(1), contactos.nombre),
      
      db
        .select({
          id: oportunidades.id,
          nombre: oportunidades.nombre,
          etapa: oportunidades.etapa,
          valorEstimado: oportunidades.valorEstimado,
          probabilidad: oportunidades.probabilidad,
          fechaCierre: oportunidades.fechaCierre,
          createdAt: oportunidades.createdAt,
        })
        .from(oportunidades)
        .where(eq(oportunidades.clienteId, id))
        .orderBy(desc(oportunidades.createdAt)),
      
      db
        .select({
          id: cotizaciones.id,
          codigo: cotizaciones.codigo,
          titulo: cotizaciones.titulo,
          estado: cotizaciones.estado,
          total: cotizaciones.total,
          fechaEmision: cotizaciones.fechaEmision,
          createdAt: cotizaciones.createdAt,
        })
        .from(cotizaciones)
        .where(eq(cotizaciones.clienteId, id))
        .orderBy(desc(cotizaciones.createdAt)),
    ])

    return {
      ...cliente,
      contactos: contactosList,
      oportunidades: oportunidadesList,
      cotizaciones: cotizacionesList,
    }
  }

  async createCliente(data: CreateClienteInput) {
    const validatedData = createClienteSchema.parse(data)
    
    const [cliente] = await db
      .insert(clientes)
      .values(validatedData)
      .returning()
    
    return cliente
  }

  async updateCliente(id: string, data: UpdateClienteInput) {
    const validatedData = updateClienteSchema.parse(data)
    
    const [cliente] = await db
      .update(clientes)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(clientes.id, id))
      .returning()
    
    if (!cliente) {
      throw new Error('Cliente no encontrado')
    }
    
    return cliente
  }

  async deleteCliente(id: string) {
    const [cliente] = await db
      .delete(clientes)
      .where(eq(clientes.id, id))
      .returning()
    
    if (!cliente) {
      throw new Error('Cliente no encontrado')
    }
    
    return cliente
  }

  async getClientesOptions(search?: string) {
    let whereCondition = undefined
    if (search) {
      whereCondition = or(
        like(clientes.razonSocial, `%${search}%`),
        like(clientes.nombreComercial, `%${search}%`)
      )
    }

    const clientesList = await db
      .select({
        id: clientes.id,
        razonSocial: clientes.razonSocial,
        nombreComercial: clientes.nombreComercial,
        ruc: clientes.ruc,
        estado: clientes.estado,
      })
      .from(clientes)
      .where(whereCondition)
      .orderBy(asc(clientes.razonSocial))
      .limit(50)

    return clientesList
  }

  // CONTACTOS CRUD
  async getContactosByCliente(clienteId: string) {
    return await db
      .select()
      .from(contactos)
      .where(eq(contactos.clienteId, clienteId))
      .orderBy(contactos.esPrincipal ? desc(1) : asc(1), contactos.nombre)
  }

  async createContacto(data: CreateContactoInput) {
    const validatedData = createContactoSchema.parse(data)
    
    // If this is the principal contact, update other contacts
    if (validatedData.esPrincipal) {
      await db
        .update(contactos)
        .set({ esPrincipal: false })
        .where(eq(contactos.clienteId, validatedData.clienteId))
    }
    
    const [contacto] = await db
      .insert(contactos)
      .values(validatedData)
      .returning()
    
    return contacto
  }

  async updateContacto(id: string, data: Partial<CreateContactoInput>) {
    const validatedData = createContactoSchema.partial().parse(data)
    
    // If this is the principal contact, update other contacts
    if (validatedData.esPrincipal) {
      const [currentContacto] = await db
        .select()
        .from(contactos)
        .where(eq(contactos.id, id))
        .limit(1)
      
      if (currentContacto) {
        await db
          .update(contactos)
          .set({ esPrincipal: false })
          .where(eq(contactos.clienteId, currentContacto.clienteId))
      }
    }
    
    const [contacto] = await db
      .update(contactos)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(contactos.id, id))
      .returning()
    
    if (!contacto) {
      throw new Error('Contacto no encontrado')
    }
    
    return contacto
  }

  async deleteContacto(id: string) {
    const [contacto] = await db
      .delete(contactos)
      .where(eq(contactos.id, id))
      .returning()
    
    if (!contacto) {
      throw new Error('Contacto no encontrado')
    }
    
    return contacto
  }

  // ESTADÍSTICAS
  async getClientesStats() {
    const [
      totalStats,
      estadoStats,
      sectorStats,
      nuevosStats
    ] = await Promise.all([
      db
        .select({
          total: clientes.id,
        })
        .from(clientes),
      
      db
        .select({
          estado: clientes.estado,
          count: clientes.id,
        })
        .from(clientes)
        .groupBy(clientes.estado),
      
      db
        .select({
          sector: clientes.sector,
          count: clientes.id,
        })
        .from(clientes)
        .where(clientes.sector.isNotNull())
        .groupBy(clientes.sector)
        .orderBy(desc(clientes.sector)),
      
      db
        .select({
          count: clientes.id,
        })
        .from(clientes)
        .where(
          and(
            clientes.createdAt.gte(new Date(new Date().setMonth(new Date().getMonth() - 1))),
            clientes.createdAt.lt(new Date())
          )
        ),
    ])

    return {
      total: totalStats.length,
      porEstado: estadoStats,
      porSector: sectorStats,
      nuevosEsteMes: Number(nuevosStats[0]?.count || 0),
    }
  }
}

export const clientesService = new ClientesService()

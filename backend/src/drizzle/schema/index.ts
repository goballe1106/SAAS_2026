import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb, pgEnum, date, decimal } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================================
// ENUMS
// ============================================================

export const estadoUsuarioEnum = pgEnum('estado_usuario', ['activo', 'inactivo', 'bloqueado'])
export const nivelRolEnum = pgEnum('nivel_rol', ['admin', 'gerente', 'supervisor', 'empleado', 'contador'])
export const accionAuditoriaEnum = pgEnum('accion_auditoria', ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT'])

// COMERCIAL MODULE ENUMS
export const estadoClienteEnum = pgEnum('estado_cliente', ['prospecto', 'activo', 'inactivo', 'potencial'])
export const tipoContactoEnum = pgEnum('tipo_contacto', ['principal', 'facturacion', 'tecnico', 'comercial'])
export const etapaOportunidadEnum = pgEnum('etapa_oportunidad', ['contacto', 'calificacion', 'propuesta', 'negociacion', 'cerrado_ganado', 'cerrado_perdido'])
export const tipoActividadEnum = pgEnum('tipo_actividad', ['llamada', 'reunion', 'email', 'visita', 'tarea', 'nota'])
export const estadoProyecto = pgEnum('estado_proyecto', [
  'propuesta',
  'aprobado', 
  'iniciado',
  'en_progreso',
  'en_revision',
  'cerrado',
  'pausado',
  'cancelado'
])

export const prioridadProyecto = pgEnum('prioridad_proyecto', [
  'baja',
  'media', 
  'alta',
  'critica'
])

export const tipoHito = pgEnum('tipo_hito', [
  'inicio',
  'entrega',
  'revision',
  'aprobacion',
  'cierre'
])

export const estadoRecurso = pgEnum('estado_recurso', [
  'asignado',
  'disponible',
  'no_disponible'
])

export const tipoDocumento = pgEnum('tipo_documento', [
  'requisitos',
  'diseno',
  'contrato',
  'informe',
  'factura',
  'otros'
])

export const tipoSeguimiento = pgEnum('tipo_seguimiento', [
  'avance',
  'riesgo',
  'cambio',
  'decision',
  'problema'
])

export const estadoCotizacionEnum = pgEnum('estado_cotizacion', ['borrador', 'enviada', 'aceptada', 'rechazada', 'convertida'])

// ============================================================
// CORE: AREAS (organizational units, self-referencing hierarchy)
// ============================================================

export const areas = pgTable('areas', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  codigo: varchar('codigo', { length: 20 }).unique(),
  descripcion: text('descripcion'),
  padreId: uuid('padre_id').references((): any => areas.id, { onDelete: 'set null' }),
  responsableId: uuid('responsable_id'),
  activo: boolean('activo').default(true).notNull(),
  orden: integer('orden').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================
// CORE: ROLES
// ============================================================

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: varchar('nombre', { length: 50 }).notNull().unique(),
  descripcion: text('descripcion'),
  nivel: nivelRolEnum('nivel').notNull(),
  activo: boolean('activo').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================
// CORE: PERMISOS
// ============================================================

export const permisos = pgTable('permisos', {
  id: uuid('id').primaryKey().defaultRandom(),
  modulo: varchar('modulo', { length: 50 }).notNull(),
  accion: varchar('accion', { length: 50 }).notNull(),
  descripcion: text('descripcion'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================================
// CORE: ROLES_PERMISOS (many-to-many)
// ============================================================

export const rolesPermisos = pgTable('roles_permisos', {
  id: uuid('id').primaryKey().defaultRandom(),
  rolId: uuid('rol_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permisoId: uuid('permiso_id').notNull().references(() => permisos.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================================
// CORE: USUARIOS
// ============================================================

export const usuarios = pgTable('usuarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  apellido: varchar('apellido', { length: 100 }).notNull(),
  telefono: varchar('telefono', { length: 20 }),
  avatar: varchar('avatar', { length: 500 }),
  areaId: uuid('area_id').references(() => areas.id, { onDelete: 'set null' }),
  estado: estadoUsuarioEnum('estado').default('activo').notNull(),
  ultimoLogin: timestamp('ultimo_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================
// CORE: USUARIOS_ROLES (user-role-area mapping)
// ============================================================

export const usuariosRoles = pgTable('usuarios_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  rolId: uuid('rol_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  areaId: uuid('area_id').references(() => areas.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================================
// AUTH: TOKENS_SESION
// ============================================================

export const tokenesSesion = pgTable('tokens_sesion', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  refreshToken: text('refresh_token').notNull(),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================================
// SYSTEM: AUDITORIA_LOGS
// ============================================================

export const auditoriaLogs = pgTable('auditoria_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'set null' }),
  accion: accionAuditoriaEnum('accion').notNull(),
  modulo: varchar('modulo', { length: 50 }).notNull(),
  registroId: uuid('registro_id'),
  datosAnteriores: jsonb('datos_anteriores'),
  datosNuevos: jsonb('datos_nuevos'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================================
// SYSTEM: NOTIFICACIONES
// ============================================================

export const notificaciones = pgTable('notificaciones', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  titulo: varchar('titulo', { length: 200 }).notNull(),
  mensaje: text('mensaje').notNull(),
  tipo: varchar('tipo', { length: 50 }).default('info').notNull(),
  leida: boolean('leida').default(false).notNull(),
  enlace: varchar('enlace', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ============================================================
// SYSTEM: CONFIGURACIONES
// ============================================================

export const configuraciones = pgTable('configuraciones', {
  id: uuid('id').primaryKey().defaultRandom(),
  clave: varchar('clave', { length: 100 }).notNull().unique(),
  valor: text('valor'),
  descripcion: text('descripcion'),
  tipo: varchar('tipo', { length: 20 }).default('string').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================
// RELATIONS
// ============================================================

export const areasRelations = relations(areas, ({ one, many }) => ({
  padre: one(areas, { fields: [areas.padreId], references: [areas.id], relationName: 'areaHierarchy' }),
  hijos: many(areas, { relationName: 'areaHierarchy' }),
  usuarios: many(usuarios),
  responsable: one(usuarios, { fields: [areas.responsableId], references: [usuarios.id], relationName: 'areaResponsable' }),
}))

export const rolesRelations = relations(roles, ({ many }) => ({
  usuariosRoles: many(usuariosRoles),
  rolesPermisos: many(rolesPermisos),
}))

export const permisosRelations = relations(permisos, ({ many }) => ({
  rolesPermisos: many(rolesPermisos),
}))

export const rolesPermisosRelations = relations(rolesPermisos, ({ one }) => ({
  rol: one(roles, { fields: [rolesPermisos.rolId], references: [roles.id] }),
  permiso: one(permisos, { fields: [rolesPermisos.permisoId], references: [permisos.id] }),
}))

export const usuariosRelations = relations(usuarios, ({ one, many }) => ({
  area: one(areas, { fields: [usuarios.areaId], references: [areas.id] }),
  usuariosRoles: many(usuariosRoles),
  tokenesSesion: many(tokenesSesion),
  notificaciones: many(notificaciones),
  areasResponsable: many(areas, { relationName: 'areaResponsable' }),
}))

export const usuariosRolesRelations = relations(usuariosRoles, ({ one }) => ({
  usuario: one(usuarios, { fields: [usuariosRoles.usuarioId], references: [usuarios.id] }),
  rol: one(roles, { fields: [usuariosRoles.rolId], references: [roles.id] }),
  area: one(areas, { fields: [usuariosRoles.areaId], references: [areas.id] }),
}))

export const tokenesSesionRelations = relations(tokenesSesion, ({ one }) => ({
  usuario: one(usuarios, { fields: [tokenesSesion.usuarioId], references: [usuarios.id] }),
}))

export const auditoriaLogsRelations = relations(auditoriaLogs, ({ one }) => ({
  usuario: one(usuarios, { fields: [auditoriaLogs.usuarioId], references: [usuarios.id] }),
}))

export const notificacionesRelations = relations(notificaciones, ({ one }) => ({
  usuario: one(usuarios, { fields: [notificaciones.usuarioId], references: [usuarios.id] }),
}))

// ============================================================
// COMERCIAL MODULE
// ============================================================

// CLIENTES
export const clientes = pgTable('clientes', {
  id: uuid('id').primaryKey().defaultRandom(),
  ruc: varchar('ruc', { length: 20 }).unique(),
  razonSocial: varchar('razon_social', { length: 200 }).notNull(),
  nombreComercial: varchar('nombre_comercial', { length: 200 }),
  direccion: text('direccion'),
  telefono: varchar('telefono', { length: 50 }),
  email: varchar('email', { length: 100 }),
  web: varchar('web', { length: 200 }),
  estado: estadoClienteEnum('estado').default('prospecto').notNull(),
  sector: varchar('sector', { length: 50 }),
  actividad: varchar('actividad', { length: 100 }),
  descripcion: text('descripcion'),
  notas: text('notas'),
  areaId: uuid('area_id').references((): any => areas.id, { onDelete: 'set null' }),
  responsableId: uuid('responsable_id').references((): any => usuarios.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// CONTACTOS
export const contactos = pgTable('contactos', {
  id: uuid('id').primaryKey().defaultRandom(),
  clienteId: uuid('cliente_id').references((): any => clientes.id, { onDelete: 'cascade' }).notNull(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  apellido: varchar('apellido', { length: 100 }),
  cargo: varchar('cargo', { length: 100 }),
  tipo: tipoContactoEnum('tipo').default('principal').notNull(),
  telefono: varchar('telefono', { length: 50 }),
  email: varchar('email', { length: 100 }),
  celular: varchar('celular', { length: 50 }),
  direccion: text('direccion'),
  notas: text('notas'),
  esPrincipal: boolean('es_principal').default(false).notNull(),
  activo: boolean('activo').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// OPORTUNIDADES
export const oportunidades = pgTable('oportunidades', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: varchar('nombre', { length: 200 }).notNull(),
  descripcion: text('descripcion'),
  clienteId: uuid('cliente_id').references((): any => clientes.id, { onDelete: 'cascade' }).notNull(),
  etapa: etapaOportunidadEnum('etapa').default('contacto').notNull(),
  valorEstimado: integer('valor_estimado'),
  probabilidad: integer('probabilidad').default(50), // 0-100
  fechaCierre: timestamp('fecha_cierre'),
  origen: varchar('origen', { length: 100 }),
  responsableId: uuid('responsable_id').references((): any => usuarios.id, { onDelete: 'set null' }),
  areaId: uuid('area_id').references((): any => areas.id, { onDelete: 'set null' }),
  motivoPerdida: text('motivo_perdida'),
  // proyectoId: uuid('proyecto_id').references((): any => proyectos.id, { onDelete: 'set null' }), // TODO: Implementar módulo de proyectos
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ACTIVIDADES
export const actividades = pgTable('actividades', {
  id: uuid('id').primaryKey().defaultRandom(),
  titulo: varchar('titulo', { length: 200 }).notNull(),
  descripcion: text('descripcion'),
  tipo: tipoActividadEnum('tipo').notNull(),
  fecha: timestamp('fecha').notNull(),
  horaInicio: timestamp('hora_inicio'),
  horaFin: timestamp('hora_fin'),
  lugar: varchar('lugar', { length: 200 }),
  oportunidadId: uuid('oportunidad_id').references((): any => oportunidades.id, { onDelete: 'cascade' }),
  clienteId: uuid('cliente_id').references((): any => clientes.id, { onDelete: 'cascade' }),
  responsableId: uuid('responsable_id').references((): any => usuarios.id, { onDelete: 'cascade' }).notNull(),
  participantes: jsonb('participantes'), // Array de user IDs
  resultado: text('resultado'),
  estado: varchar('estado', { length: 20 }).default('pendiente').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// COTIZACIONES
export const cotizaciones = pgTable('cotizaciones', {
  id: uuid('id').primaryKey().defaultRandom(),
  codigo: varchar('codigo', { length: 50 }).unique().notNull(),
  clienteId: uuid('cliente_id').references((): any => clientes.id, { onDelete: 'cascade' }).notNull(),
  oportunidadId: uuid('oportunidad_id').references((): any => oportunidades.id, { onDelete: 'set null' }),
  titulo: varchar('titulo', { length: 200 }).notNull(),
  descripcion: text('descripcion'),
  estado: estadoCotizacionEnum('estado').default('borrador').notNull(),
  fechaEmision: timestamp('fecha_emision').notNull(),
  fechaValidez: timestamp('fecha_validez'),
  subtotal: integer('subtotal').default(0),
  impuestos: integer('impuestos').default(0),
  total: integer('total').default(0),
  moneda: varchar('moneda', { length: 10 }).default('USD').notNull(),
  condiciones: text('condiciones'),
  notas: text('notas'),
  responsableId: uuid('responsable_id').references((): any => usuarios.id, { onDelete: 'set null' }),
  areaId: uuid('area_id').references((): any => areas.id, { onDelete: 'set null' }),
  // proyectoId: uuid('proyecto_id').references((): any => proyectos.id, { onDelete: 'set null' }), // TODO: Implementar módulo de proyectos
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// COTIZACION_ITEMS
export const cotizacionItems = pgTable('cotizacion_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cotizacionId: uuid('cotizacion_id').references((): any => cotizaciones.id, { onDelete: 'cascade' }).notNull(),
  itemCode: varchar('item_code', { length: 50 }),
  descripcion: text('descripcion').notNull(),
  cantidad: integer('cantidad').default(1).notNull(),
  unidad: varchar('unidad', { length: 20 }).default('unidad').notNull(),
  precioUnitario: integer('precio_unitario').notNull(),
  subtotal: integer('subtotal').notNull(),
  impuestos: integer('impuestos').default(0),
  total: integer('total').notNull(),
  orden: integer('orden').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================================
// PROJECT MANAGEMENT MODULE
// ============================================================

export const proyectos = pgTable('proyectos', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: varchar('nombre', { length: 200 }).notNull(),
  descripcion: text('descripcion'),
  codigo: varchar('codigo', { length: 50 }).unique(),
  clienteId: uuid('cliente_id').references(() => clientes.id, { onDelete: 'set null' }),
  areaId: uuid('area_id').references(() => areas.id, { onDelete: 'set null' }),
  responsableId: uuid('responsable_id').references(() => usuarios.id, { onDelete: 'set null' }),
  estado: estadoProyecto().default('propuesta').notNull(),
  prioridad: prioridadProyecto().default('media').notNull(),
  fechaInicio: date('fecha_inicio'),
  fechaFin: date('fecha_fin'),
  fechaInicioReal: date('fecha_inicio_real'),
  fechaFinReal: date('fecha_fin_real'),
  presupuesto: decimal('presupuesto', { precision: 15, scale: 2 }),
  costoReal: decimal('costo_real', { precision: 15, scale: 2 }),
  progreso: integer('progreso').default(0),
  notas: text('notas'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const centrosCosto = pgTable('centros_costo', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  codigo: varchar('codigo', { length: 20 }).unique(),
  descripcion: text('descripcion'),
  padreId: uuid('padre_id').references(() => centrosCosto.id, { onDelete: 'set null' }),
  areaId: uuid('area_id').references(() => areas.id, { onDelete: 'set null' }),
  responsableId: uuid('responsable_id').references(() => usuarios.id, { onDelete: 'set null' }),
  activo: boolean('activo').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const hitos = pgTable('hitos', {
  id: uuid('id').primaryKey().defaultRandom(),
  proyectoId: uuid('proyecto_id').references(() => proyectos.id, { onDelete: 'cascade' }).notNull(),
  nombre: varchar('nombre', { length: 200 }).notNull(),
  descripcion: text('descripcion'),
  tipo: tipoHito().notNull(),
  fechaPlanificada: date('fecha_planificada').notNull(),
  fechaReal: date('fecha_real'),
  completado: boolean('completado').default(false),
  responsableId: uuid('responsable_id').references(() => usuarios.id, { onDelete: 'set null' }),
  notas: text('notas'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const proyectoRecursos = pgTable('proyecto_recursos', {
  id: uuid('id').primaryKey().defaultRandom(),
  proyectoId: uuid('proyecto_id').references(() => proyectos.id, { onDelete: 'cascade' }).notNull(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'cascade' }).notNull(),
  areaId: uuid('area_id').references(() => areas.id, { onDelete: 'set null' }),
  rol: varchar('rol', { length: 100 }).notNull(),
  estado: estadoRecurso().default('disponible').notNull(),
  horasAsignadas: integer('horas_asignadas'),
  horasUtilizadas: integer('horas_utilizadas').default(0),
  costoHora: decimal('costo_hora', { precision: 10, scale: 2 }),
  fechaAsignacion: date('fecha_asignacion').notNull(),
  fechaLiberacion: date('fecha_liberacion'),
  notas: text('notas'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const proyectoDocumentos = pgTable('proyecto_documentos', {
  id: uuid('id').primaryKey().defaultRandom(),
  proyectoId: uuid('proyecto_id').references(() => proyectos.id, { onDelete: 'cascade' }).notNull(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  descripcion: text('descripcion'),
  tipo: tipoDocumento().notNull(),
  url: varchar('url', { length: 500 }),
  tamano: integer('tamano'),
  version: varchar('version', { length: 20 }).default('1.0'),
  subidoPor: uuid('subido_por').references(() => usuarios.id, { onDelete: 'set null' }).notNull(),
  fechaSubida: date('fecha_subida').notNull(),
  etiquetas: text('etiquetas'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const proyectoSeguimiento = pgTable('proyecto_seguimiento', {
  id: uuid('id').primaryKey().defaultRandom(),
  proyectoId: uuid('proyecto_id').references(() => proyectos.id, { onDelete: 'cascade' }).notNull(),
  tipo: tipoSeguimiento().notNull(),
  titulo: varchar('titulo', { length: 200 }).notNull(),
  descripcion: text('descripcion'),
  reportadoPor: uuid('reportado_por').references(() => usuarios.id, { onDelete: 'set null' }).notNull(),
  fechaReporte: date('fecha_reporte').notNull(),
  impacto: varchar('impacto', { length: 20 }),
  acciones: text('acciones'),
  estado: varchar('estado', { length: 20 }).default('abierto'),
  fechaCierre: date('fecha_cierre'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ============================================================
// COMERCIAL MODULE RELATIONS
// ============================================================

export const clientesRelations = relations(clientes, ({ one, many }) => ({
  area: one(areas, { fields: [clientes.areaId], references: [areas.id] }),
  responsable: one(usuarios, { fields: [clientes.responsableId], references: [usuarios.id] }),
  contactos: many(contactos),
  oportunidades: many(oportunidades),
  actividades: many(actividades),
  cotizaciones: many(cotizaciones),
}))

export const contactosRelations = relations(contactos, ({ one }) => ({
  cliente: one(clientes, { fields: [contactos.clienteId], references: [clientes.id] }),
}))

export const oportunidadesRelations = relations(oportunidades, ({ one, many }) => ({
  cliente: one(clientes, { fields: [oportunidades.clienteId], references: [clientes.id] }),
  responsable: one(usuarios, { fields: [oportunidades.responsableId], references: [usuarios.id] }),
  area: one(areas, { fields: [oportunidades.areaId], references: [areas.id] }),
  // proyecto: one(proyectos, { fields: [oportunidades.proyectoId], references: [proyectos.id] }), // TODO: Implementar módulo de proyectos
  actividades: many(actividades),
  cotizaciones: many(cotizaciones),
}))

export const actividadesRelations = relations(actividades, ({ one }) => ({
  oportunidad: one(oportunidades, { fields: [actividades.oportunidadId], references: [oportunidades.id] }),
  cliente: one(clientes, { fields: [actividades.clienteId], references: [clientes.id] }),
  responsable: one(usuarios, { fields: [actividades.responsableId], references: [usuarios.id] }),
}))

export const cotizacionesRelations = relations(cotizaciones, ({ one, many }) => ({
  cliente: one(clientes, { fields: [cotizaciones.clienteId], references: [clientes.id] }),
  oportunidad: one(oportunidades, { fields: [cotizaciones.oportunidadId], references: [oportunidades.id] }),
  responsable: one(usuarios, { fields: [cotizaciones.responsableId], references: [usuarios.id] }),
  area: one(areas, { fields: [cotizaciones.areaId], references: [areas.id] }),
  // proyecto: one(proyectos, { fields: [cotizaciones.proyectoId], references: [proyectos.id] }), // TODO: Implementar módulo de proyectos
  items: many(cotizacionItems),
}))

export const cotizacionItemsRelations = relations(cotizacionItems, ({ one }) => ({
  cotizacion: one(cotizaciones, { fields: [cotizacionItems.cotizacionId], references: [cotizaciones.id] }),
}))

// ============================================================
// PROJECT MANAGEMENT MODULE RELATIONS
// ============================================================

export const proyectosRelations = relations(proyectos, ({ one, many }) => ({
  cliente: one(clientes, { fields: [proyectos.clienteId], references: [clientes.id] }),
  area: one(areas, { fields: [proyectos.areaId], references: [areas.id] }),
  responsable: one(usuarios, { fields: [proyectos.responsableId], references: [usuarios.id] }),
  hitos: many(hitos),
  recursos: many(proyectoRecursos),
  documentos: many(proyectoDocumentos),
  seguimiento: many(proyectoSeguimiento),
}))

export const centrosCostoRelations = relations(centrosCosto, ({ one, many }) => ({
  padre: one(centrosCosto, { fields: [centrosCosto.padreId], references: [centrosCosto.id] }),
  hijos: many(centrosCosto),
  area: one(areas, { fields: [centrosCosto.areaId], references: [areas.id] }),
  responsable: one(usuarios, { fields: [centrosCosto.responsableId], references: [usuarios.id] }),
}))

export const hitosRelations = relations(hitos, ({ one }) => ({
  proyecto: one(proyectos, { fields: [hitos.proyectoId], references: [proyectos.id] }),
  responsable: one(usuarios, { fields: [hitos.responsableId], references: [usuarios.id] }),
}))

export const proyectoRecursosRelations = relations(proyectoRecursos, ({ one }) => ({
  proyecto: one(proyectos, { fields: [proyectoRecursos.proyectoId], references: [proyectos.id] }),
  usuario: one(usuarios, { fields: [proyectoRecursos.usuarioId], references: [usuarios.id] }),
  area: one(areas, { fields: [proyectoRecursos.areaId], references: [areas.id] }),
}))

export const proyectoDocumentosRelations = relations(proyectoDocumentos, ({ one }) => ({
  proyecto: one(proyectos, { fields: [proyectoDocumentos.proyectoId], references: [proyectos.id] }),
  subidoPor: one(usuarios, { fields: [proyectoDocumentos.subidoPor], references: [usuarios.id] }),
}))

export const proyectoSeguimientoRelations = relations(proyectoSeguimiento, ({ one }) => ({
  proyecto: one(proyectos, { fields: [proyectoSeguimiento.proyectoId], references: [proyectos.id] }),
  reportadoPor: one(usuarios, { fields: [proyectoSeguimiento.reportadoPor], references: [usuarios.id] }),
}))

// ============================================================
// DATABASE EXPORT
// ============================================================

export const schema = {
  usuarios,
  areas,
  roles,
  permisos,
  usuariosRoles,
  tokensSesion: tokenesSesion,
  auditoriaLogs,
  notificaciones,
  configuraciones,
  clientes,
  contactos,
  oportunidades,
  actividades,
  cotizaciones,
  cotizacionItems,
  proyectos,
  centrosCosto,
  hitos,
  proyectoRecursos,
  proyectoDocumentos,
  proyectoSeguimiento,
  clientesRelations,
  contactosRelations,
  oportunidadesRelations,
  actividadesRelations,
  cotizacionesRelations,
  cotizacionItemsRelations,
  proyectosRelations,
  centrosCostoRelations,
  hitosRelations,
  proyectoRecursosRelations,
  proyectoDocumentosRelations,
  proyectoSeguimientoRelations,
}

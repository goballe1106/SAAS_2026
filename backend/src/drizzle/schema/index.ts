import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================================
// ENUMS
// ============================================================

export const estadoUsuarioEnum = pgEnum('estado_usuario', ['activo', 'inactivo', 'bloqueado'])
export const nivelRolEnum = pgEnum('nivel_rol', ['admin', 'gerente', 'supervisor', 'empleado', 'contador'])
export const accionAuditoriaEnum = pgEnum('accion_auditoria', ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT'])

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

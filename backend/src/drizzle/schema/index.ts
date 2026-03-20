import { pgTable, uuid, varchar, timestamp, boolean, text, integer, pgEnum } from 'drizzle-orm/pg-core';

export const rolEnum = pgEnum('rol', ['admin', 'gerente', 'supervisor', 'empleado', 'contador']);
export const estadoEnum = pgEnum('estado', ['activo', 'inactivo', 'suspendido']);
export const tipoAreaEnum = pgEnum('tipo_area', ['empresa', 'direccion', 'departamento', 'area', 'proyecto']);

export const usuarios = pgTable('usuarios', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  nombreCompleto: varchar('nombre_completo', { length: 150 }).notNull(),
  telefono: varchar('telefono', { length: 20 }),
  whatsapp: varchar('whatsapp', { length: 20 }),
  telegram: varchar('telegram', { length: 20 }),
  fotoUrl: varchar('foto_url', { length: 500 }),
  rol: rolEnum('rol').notNull().default('empleado'),
  areaId: uuid('area_id'),
  activo: boolean('activo').notNull().default(true),
  debeCambiarPassword: boolean('debe_cambiar_password').notNull().default(false),
  ultimoLogin: timestamp('ultimo_login'),
  intentosLogin: integer('intentos_login').notNull().default(0),
  bloqueadoHasta: timestamp('bloqueado_hasta'),
  idioma: varchar('idioma', { length: 10 }).notNull().default('es'),
  zonaHoraria: varchar('zona_horaria', { length: 50 }).notNull().default('America/Lima'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),
});

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  nombre: varchar('nombre', { length: 50 }).notNull().unique(),
  descripcion: text('descripcion'),
  nivel: integer('nivel').notNull().default(0),
  activo: boolean('activo').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const permisos = pgTable('permisos', {
  id: uuid('id').defaultRandom().primaryKey(),
  modulo: varchar('modulo', { length: 50 }).notNull(),
  accion: varchar('accion', { length: 50 }).notNull(),
  descripcion: text('descripcion'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const rolesPermisos = pgTable('roles_permisos', {
  id: uuid('id').defaultRandom().primaryKey(),
  rolId: uuid('rol_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permisoId: uuid('permiso_id').notNull().references(() => permisos.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const areas = pgTable('areas', {
  id: uuid('id').defaultRandom().primaryKey(),
  codigo: varchar('codigo', { length: 20 }).notNull().unique(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  descripcion: text('descripcion'),
  imagenUrl: varchar('imagen_url', { length: 500 }),
  padreId: uuid('padre_id'),
  gerenteId: uuid('gerente_id'),
  presupuesto: integer('presupuesto'),
  tipo: tipoAreaEnum('tipo').notNull().default('area'),
  activo: boolean('activo').notNull().default(true),
  orden: integer('orden').notNull().default(0),
  color: varchar('color', { length: 7 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const usuariosRoles = pgTable('usuarios_roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  rolId: uuid('rol_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  areaId: uuid('area_id').references(() => areas.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const tokensSesion = pgTable('tokens_sesion', {
  id: uuid('id').defaultRandom().primaryKey(),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 500 }).notNull(),
  tipo: varchar('tipo', { length: 20 }).notNull().default('access'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  revokedAt: timestamp('revoked_at'),
});

export const configuraciones = pgTable('configuraciones', {
  id: uuid('id').defaultRandom().primaryKey(),
  clave: varchar('clave', { length: 100 }).notNull().unique(),
  valor: text('valor'),
  descripcion: text('descripcion'),
  tipo: varchar('tipo', { length: 20 }).notNull().default('string'),
  modulo: varchar('modulo', { length: 50 }),
  editable: boolean('editable').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

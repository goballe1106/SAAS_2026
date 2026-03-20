import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import bcrypt from 'bcrypt'
import * as schema from './schema'

async function seed() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'erp_sas',
    password: process.env.DB_PASSWORD || 'ErpSas2026!',
    database: process.env.DB_NAME || 'erp_sas',
  })

  const db = drizzle(pool, { schema })

  console.log('🌱 Seeding database...')

  // Create default roles
  const [adminRole] = await db.insert(schema.roles).values([
    { nombre: 'Administrador', descripcion: 'Acceso total al sistema', nivel: 'admin' },
    { nombre: 'Gerente', descripcion: 'Gestión de departamentos y proyectos', nivel: 'gerente' },
    { nombre: 'Supervisor', descripcion: 'Supervisión de equipos', nivel: 'supervisor' },
    { nombre: 'Empleado', descripcion: 'Acceso básico al sistema', nivel: 'empleado' },
    { nombre: 'Contador', descripcion: 'Acceso a módulos financieros', nivel: 'contador' },
  ]).returning()

  console.log('✅ Roles created')

  // Create default areas
  const [dirGeneral] = await db.insert(schema.areas).values([
    { nombre: 'Dirección General', codigo: 'DIR', descripcion: 'Alta dirección de la empresa', orden: 1 },
  ]).returning()

  await db.insert(schema.areas).values([
    { nombre: 'Tecnología', codigo: 'TI', descripcion: 'Departamento de TI', padreId: dirGeneral.id, orden: 2 },
    { nombre: 'Recursos Humanos', codigo: 'RRHH', descripcion: 'Gestión del talento humano', padreId: dirGeneral.id, orden: 3 },
    { nombre: 'Operaciones', codigo: 'OPS', descripcion: 'Operaciones y proyectos', padreId: dirGeneral.id, orden: 4 },
    { nombre: 'Comercial', codigo: 'COM', descripcion: 'Ventas y relaciones comerciales', padreId: dirGeneral.id, orden: 5 },
    { nombre: 'Finanzas', codigo: 'FIN', descripcion: 'Contabilidad y finanzas', padreId: dirGeneral.id, orden: 6 },
    { nombre: 'Logística', codigo: 'LOG', descripcion: 'Inventario y almacenes', padreId: dirGeneral.id, orden: 7 },
  ])

  console.log('✅ Areas created')

  // Create default permisos
  const modules = ['auth', 'usuarios', 'areas', 'roles', 'dashboard', 'proyectos', 'tickets', 'inventario', 'rrhh', 'comercial', 'compras', 'flota', 'contabilidad', 'configuracion', 'auditoria']
  const actions = ['ver', 'crear', 'editar', 'eliminar', 'exportar']

  const permisosData = modules.flatMap(modulo =>
    actions.map(accion => ({
      modulo,
      accion,
      descripcion: `${accion.charAt(0).toUpperCase() + accion.slice(1)} en módulo ${modulo}`,
    }))
  )

  const insertedPermisos = await db.insert(schema.permisos).values(permisosData).returning()
  console.log(`✅ ${insertedPermisos.length} Permisos created`)

  // Assign all permisos to admin role
  await db.insert(schema.rolesPermisos).values(
    insertedPermisos.map(p => ({ rolId: adminRole.id, permisoId: p.id }))
  )
  console.log('✅ Admin role permissions assigned')

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 12)
  const [adminUser] = await db.insert(schema.usuarios).values({
    email: 'admin@erp.com',
    password: hashedPassword,
    nombre: 'Admin',
    apellido: 'Sistema',
    estado: 'activo',
  }).returning()

  // Assign admin role to admin user
  await db.insert(schema.usuariosRoles).values({
    usuarioId: adminUser.id,
    rolId: adminRole.id,
  })

  console.log('✅ Admin user created: admin@erp.com / Admin123!')

  console.log('\n🎉 Seed completed successfully!')
  await pool.end()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})

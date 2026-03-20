import { db } from './config/database.js';
import { usuarios, roles, permisos, areas } from './schema/index.js';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Iniciando seed de datos...');

  try {
    // 1. Crear roles
    console.log('📦 Creando roles...');
    const rolesData = [
      { nombre: 'admin', descripcion: 'Administrador del sistema', nivel: 100 },
      { nombre: 'gerente', descripcion: 'Gerente de área', nivel: 80 },
      { nombre: 'supervisor', descripcion: 'Supervisor de equipo', nivel: 60 },
      { nombre: 'contador', descripcion: 'Encargado de contabilidad', nivel: 40 },
      { nombre: 'empleado', descripcion: 'Empleado básico', nivel: 20 },
    ];

    for (const rol of rolesData) {
      await db.insert(roles).values(rol).onConflictDoNothing();
    }
    console.log('✅ Roles creados');

    // 2. Crear permisos
    console.log('📦 Creando permisos...');
    const permisosData = [
      // Usuarios
      { modulo: 'usuarios', accion: 'crear', descripcion: 'Crear usuarios' },
      { modulo: 'usuarios', accion: 'leer', descripcion: 'Ver usuarios' },
      { modulo: 'usuarios', accion: 'actualizar', descripcion: 'Actualizar usuarios' },
      { modulo: 'usuarios', accion: 'eliminar', descripcion: 'Eliminar usuarios' },
      
      // Áreas
      { modulo: 'areas', accion: 'crear', descripcion: 'Crear áreas' },
      { modulo: 'areas', accion: 'leer', descripcion: 'Ver áreas' },
      { modulo: 'areas', accion: 'actualizar', descripcion: 'Actualizar áreas' },
      { modulo: 'areas', accion: 'eliminar', descripcion: 'Eliminar áreas' },
      
      // Roles
      { modulo: 'roles', accion: 'crear', descripcion: 'Crear roles' },
      { modulo: 'roles', accion: 'leer', descripcion: 'Ver roles' },
      { modulo: 'roles', accion: 'actualizar', descripcion: 'Actualizar roles' },
      { modulo: 'roles', accion: 'eliminar', descripcion: 'Eliminar roles' },
      
      // Proyectos
      { modulo: 'proyectos', accion: 'crear', descripcion: 'Crear proyectos' },
      { modulo: 'proyectos', accion: 'leer', descripcion: 'Ver proyectos' },
      { modulo: 'proyectos', accion: 'actualizar', descripcion: 'Actualizar proyectos' },
      { modulo: 'proyectos', accion: 'eliminar', descripcion: 'Eliminar proyectos' },
      
      // Tickets
      { modulo: 'tickets', accion: 'crear', descripcion: 'Crear tickets' },
      { modulo: 'tickets', accion: 'leer', descripcion: 'Ver tickets' },
      { modulo: 'tickets', accion: 'actualizar', descripcion: 'Actualizar tickets' },
      { modulo: 'tickets', accion: 'eliminar', descripcion: 'Eliminar tickets' },
      
      // Inventario
      { modulo: 'inventario', accion: 'crear', descripcion: 'Crear items' },
      { modulo: 'inventario', accion: 'leer', descripcion: 'Ver inventario' },
      { modulo: 'inventario', accion: 'actualizar', descripcion: 'Actualizar inventario' },
      { modulo: 'inventario', accion: 'eliminar', descripcion: 'Eliminar items' },
    ];

    for (const permiso of permisosData) {
      await db.insert(permisos).values(permiso).onConflictDoNothing();
    }
    console.log('✅ Permisos creados');

    // 3. Crear áreas
    console.log('📦 Creando áreas...');
    const areasData = [
      { codigo: 'DIR', nombre: 'Dirección General', tipo: 'direccion', nivel: 1, color: '#1e40af' },
      { codigo: 'GTH', nombre: 'Gestión de Talento Humano', tipo: 'departamento', nivel: 2, color: '#7c3aed' },
      { codigo: 'CON', nombre: 'Contabilidad', tipo: 'departamento', nivel: 2, color: '#059669' },
      { codigo: 'LOG', nombre: 'Logística', tipo: 'departamento', nivel: 2, color: '#dc2626' },
      { codigo: 'TIC', nombre: 'Tecnología de Información', tipo: 'departamento', nivel: 2, color: '#0891b2' },
      { codigo: 'PRO', nombre: 'Proyectos', tipo: 'departamento', nivel: 2, color: '#f59e0b' },
      { codigo: 'SUP', nombre: 'Supervisión', tipo: 'area', nivel: 3, color: '#6366f1' },
      { codigo: 'OPE', nombre: 'Operaciones', tipo: 'area', nivel: 3, color: '#14b8a6' },
    ];

    for (const area of areasData) {
      await db.insert(areas).values(area).onConflictDoNothing();
    }
    console.log('✅ Áreas creadas');

    // 4. Crear usuario administrador
    console.log('📦 Creando usuario administrador...');
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    
    const adminExists = await db.select()
      .from(usuarios)
      .where({ email: 'admin@erp.com' })
      .limit(1);

    if (adminExists.length === 0) {
      await db.insert(usuarios).values({
        email: 'admin@erp.com',
        passwordHash: adminPassword,
        nombreCompleto: 'Administrador del Sistema',
        telefono: '999999999',
        rol: 'admin',
        activo: true,
        idioma: 'es',
        zonaHoraria: 'America/Lima',
      });
      console.log('✅ Usuario administrador creado');
    } else {
      console.log('ℹ️ Usuario administrador ya existe');
    }

    // 5. Crear usuario de prueba
    console.log('📦 Creando usuario de prueba...');
    const testPassword = await bcrypt.hash('Usuario123!', 12);
    
    const testExists = await db.select()
      .from(usuarios)
      .where({ email: 'giovanni@erp.com' })
      .limit(1);

    if (testExists.length === 0) {
      await db.insert(usuarios).values({
        email: 'giovanni@erp.com',
        passwordHash: testPassword,
        nombreCompleto: 'Giovanni Desarrollador',
        telefono: '999999998',
        rol: 'gerente',
        activo: true,
        idioma: 'es',
        zonaHoraria: 'America/Lima',
      });
      console.log('✅ Usuario de prueba creado');
    } else {
      console.log('ℹ️ Usuario de prueba ya existe');
    }

    console.log('✅ Seed completado exitosamente!');
    console.log('');
    console.log('📝 Credenciales de acceso:');
    console.log('   Admin: admin@erp.com / Admin123!');
    console.log('   Usuario: giovanni@erp.com / Usuario123!');

  } catch (error) {
    console.error('❌ Error en seed:', error);
  } finally {
    process.exit(0);
  }
}

seed();

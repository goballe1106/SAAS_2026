# ERP SAS - Backend

Sistema de Gestión Empresarial - API REST

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker
- Docker Compose

### Instalación

1. Clonar el repositorio
2. Crear archivo `.env` basado en `.env.example`
3. Ejecutar:

```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Detener servicios
docker-compose down
```

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Generar cliente Drizzle
npm run db:generate

# Push schema a DB
npm run db:push

# Seed de datos iniciales
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

## 📡 API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Iniciar sesión |
| POST | `/api/v1/auth/register` | Registrar usuario |
| POST | `/api/v1/auth/logout` | Cerrar sesión |
| GET | `/api/v1/auth/me` | Obtener usuario actual |
| POST | `/api/v1/auth/change-password` | Cambiar contraseña |

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/usuarios` | Listar usuarios |
| GET | `/api/v1/usuarios/:id` | Obtener usuario |
| POST | `/api/v1/usuarios` | Crear usuario |
| PUT | `/api/v1/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/v1/usuarios/:id` | Eliminar usuario |

### Áreas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/areas` | Listar áreas |
| GET | `/api/v1/areas/tree` | Árbol de áreas |
| GET | `/api/v1/areas/options` | Opciones para select |
| GET | `/api/v1/areas/:id` | Obtener área |
| POST | `/api/v1/areas` | Crear área |
| PUT | `/api/v1/areas/:id` | Actualizar área |
| DELETE | `/api/v1/areas/:id` | Eliminar área |

### Roles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/roles` | Listar roles |
| GET | `/api/v1/roles/permisos` | Listar permisos |
| GET | `/api/v1/roles/:id` | Obtener rol |
| POST | `/api/v1/roles` | Crear rol |
| PUT | `/api/v1/roles/:id` | Actualizar rol |
| POST | `/api/v1/roles/:id/permisos` | Asignar permisos |

### Dashboard

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/dashboard` | Dashboard principal |
| GET | `/api/v1/dashboard/usuarios` | Métricas de usuarios |
| GET | `/api/v1/dashboard/areas` | Métricas de áreas |

## 📚 Documentación

Accede a Swagger UI en: `http://localhost:3001/docs`

## 🔐 Credenciales (Seed)

- **Admin**: `admin@erp.com` / `Admin123!`
- **Usuario**: `giovanni@erp.com` / `Usuario123!`

## 🛠️ Stack Tecnológico

- Node.js 20
- Fastify
- Drizzle ORM
- PostgreSQL 16
- Redis
- TypeScript

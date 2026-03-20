# 🚀 ERP SAS - Deployment Guide

## Quick Start

### Desarrollo Local
```bash
cd ERP_SAS
docker-compose up -d
```

### Producción
```bash
# 1. Configurar variables de entorno
cp .env.example .env
nano .env

# 2. Build y start
docker-compose -f docker-compose.production.yml up -d --build

# 3. Ver logs
docker-compose -f docker-compose.production.yml logs -f
```

## Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 80 | http://localhost |
| API | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |

## Estructura de Production

```
ERP_SAS/
├── backend/           # API Node.js
├── frontend/         # React build
├── nginx/            # Config Nginx
├── docker-compose.production.yml
└── .env
```

## Comandos Útiles

```bash
# Reiniciar servicios
docker-compose restart

# Ver logs
docker-compose logs -f api

# Ejecutar migraciones
docker-compose exec api npm run db:push

# Seed de datos
docker-compose exec api npm run db:seed

# Backup PostgreSQL
docker-compose exec db pg_dump -U erp_sas erp_sas > backup.sql

# Restore PostgreSQL
cat backup.sql | docker-compose exec -T db psql -U erp_sas erp_sas
```

## SSL/HTTPS con Let's Encrypt

Para producción con HTTPS:

1. Configurar dominio en `.env`:
```bash
APP_URL=https://erp.tudominio.com
```

2. Usar nginx-proxy con Let's Encrypt:
```yaml
# Añadir al docker-compose
nginx-proxy:
  image: jwilder/nginx-proxy
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - /var/run/docker.sock:/tmp/docker.sock:ro
    - ./certs:/etc/nginx/certs:ro
    - ./html:/usr/share/nginx/html
    - ./vhost.d:/etc/nginx/vhost.d
```

## dokploy (Opcional)

Para auto-deployment con Git:

```bash
# Instalar dokploy
curl -fsSL https://get.dokploy.com | sh

# Luego desde la UI de dokploy:
# 1. Create Project
# 2. Connect GitHub repo
# 3. Deploy with docker-compose
```

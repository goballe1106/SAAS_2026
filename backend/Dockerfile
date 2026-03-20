FROM node:20-alpine

WORKDIR /app

# Instalar dependencias globales
RUN npm install -g pm2

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# No compilar TypeScript - usar tsx directamente en desarrollo
# RUN npm run build

# Exponer puerto
EXPOSE 3001

# Comando de inicio - usar tsx para desarrollo rápido
CMD ["npm", "run", "dev"]

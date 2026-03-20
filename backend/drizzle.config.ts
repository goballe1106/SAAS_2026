import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/drizzle/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'erp_sas',
    password: process.env.DB_PASSWORD || 'ErpSas2026!',
    database: process.env.DB_NAME || 'erp_sas',
  },
})

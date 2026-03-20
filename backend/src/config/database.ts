import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../drizzle/schema'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'erp_sas',
  password: process.env.DB_PASSWORD || 'ErpSas2026!',
  database: process.env.DB_NAME || 'erp_sas',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

export const db = drizzle(pool, { schema })
export { pool }

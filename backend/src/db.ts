import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './drizzle/schema/minimal'

const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER || 'erp_sas'}:${process.env.DB_PASSWORD || 'ErpSas2026!'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'erp_sas'}`

const client = postgres(connectionString, {
  prepare: false,
})

export const db = drizzle(client, { schema })

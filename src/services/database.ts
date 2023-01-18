import { config } from 'dotenv'
import knex from 'knex'

config()

export const database = knex.knex({
  client: 'mysql2',
  connection: {
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT ?? ''),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  }
})

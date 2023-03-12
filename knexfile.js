import { config } from 'dotenv'

config()

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DATABASE_HOST,
      port: Number.parseInt(process.env.DATABASE_PORT ?? ''),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DATABASE_HOST,
      port: Number.parseInt(process.env.DATABASE_PORT ?? ''),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}

import { config } from 'dotenv'
import knex from 'knex'

import { log } from '../utils/index.js'

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

const initialiseDatabase = async () => {
  const commandUsage = await database.schema.hasTable('command_usage')
  if (!commandUsage) {
    log.info('Creating table: command_usage')
    await database.schema.createTable('command_usage', table => {
      table.string('commandName', 64).notNullable().primary().unique().index()
      table.integer('invocations').notNullable().defaultTo(0)
      table.timestamp('lastUsed').notNullable().defaultTo(database.fn.now())
    })
  }

  const linkedAccounts = await database.schema.hasTable('linked_accounts')
  if (!linkedAccounts) {
    log.info('Creating table: linked_accounts')
    await database.schema.createTable('linked_accounts', table => {
      table.string('discordId', 18).notNullable().primary().unique().index()
      table.string('steamId', 17).notNullable().unique().index()
      table.timestamp('createdAt').notNullable().defaultTo(database.fn.now())
    })
  }

  const paginatedMessages = await database.schema.hasTable('paginated_messages')
  if (!paginatedMessages) {
    log.info('Creating table: paginated_messages')
    await database.schema.createTable('paginated_messages', table => {
      table.string('messageId', 19).notNullable().primary().unique().index()
      table.integer('currentPage').notNullable().defaultTo(1)
      table.json('query').notNullable().defaultTo({})
      table.timestamp('createdAt').notNullable().defaultTo(database.fn.now())
      table.timestamp('updatedAt').notNullable().defaultTo(database.fn.now())
    })
  }
}

initialiseDatabase()

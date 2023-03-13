/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return await knex.schema.table('twitch_streams', table => {
    table.integer('peakViewers').notNullable().defaultTo(0)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return await knex.schema.alterTable('twitch_streams', table => {
    table.dropColumn('peakViewers')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return (
    knex.schema.alterTable('twitch_streams'),
    table => {
      table.integer('peakViewers').notNullable().defaultTo(0)
    }
  )
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('twitch_streams', table => {
    table.dropColumn('peakViewers')
  })
}

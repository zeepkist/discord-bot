import { config } from 'dotenv';
import knex from 'knex';
import { log } from '../utils/index.js';
config();
export const database = knex.knex({
    client: 'mysql2',
    connection: {
        host: process.env.DATABASE_HOST,
        port: Number.parseInt(process.env.DATABASE_PORT ?? ''),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    }
});
const initialiseDatabase = async () => {
    const commandUsage = await database.schema.hasTable('command_usage');
    if (!commandUsage) {
        log.info('Creating table: command_usage');
        await database.schema.createTable('command_usage', table => {
            table.string('commandName', 64).notNullable().primary().unique().index();
            table.integer('invocations').notNullable().defaultTo(0);
            table.timestamp('lastUsed').notNullable().defaultTo(database.fn.now());
        });
    }
    const linkedAccounts = await database.schema.hasTable('linked_accounts');
    if (!linkedAccounts) {
        log.info('Creating table: linked_accounts');
        await database.schema.createTable('linked_accounts', table => {
            table.string('discordId', 18).notNullable().primary().unique().index();
            table.string('steamId', 17).notNullable().unique().index();
            table.timestamp('createdAt').notNullable().defaultTo(database.fn.now());
        });
    }
    const paginatedMessages = await database.schema.hasTable('paginated_messages');
    if (!paginatedMessages) {
        log.info('Creating table: paginated_messages');
        await database.schema.createTable('paginated_messages', table => {
            table.string('messageId', 19).notNullable().primary().unique().index();
            table.integer('currentPage').notNullable().defaultTo(1);
            table.json('query').notNullable().defaultTo({});
            table.timestamp('createdAt').notNullable().defaultTo(database.fn.now());
            table.timestamp('updatedAt').notNullable().defaultTo(database.fn.now());
        });
    }
    const twitchStreams = await database.schema.hasTable('twitch_streams');
    if (!twitchStreams) {
        log.info('Creating table: twitch_streams');
        await database.schema.createTable('twitch_streams', table => {
            table.string('messageId').notNullable().unique().index().primary();
            table.string('streamId', 36).notNullable().index();
            table.string('userId', 36).notNullable().index();
            table.string('userName', 64).notNullable().index();
            table.boolean('isLive').notNullable().defaultTo(true);
            table.integer('viewers').notNullable().defaultTo(0);
            table.integer('peakViewers').notNullable().defaultTo(0);
            table
                .text('profilePictureUrl')
                .notNullable()
                .defaultTo('https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-twitch/contentbuilder/community-meetups_event-thumbnail_400x400.png');
            table.timestamp('createdAt').notNullable().defaultTo(database.fn.now());
            table.timestamp('updatedAt').notNullable().defaultTo(database.fn.now());
        });
    }
};
initialiseDatabase();

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import interactionCreate from './listeners/interactionCreate.js';
import ready from './listeners/ready.js';
import { log } from './utils/index.js';
config();
log.info('Bot is starting');
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});
client.once(Events.ClientReady, ready);
interactionCreate(client);
client.login(process.env.DISCORD_TOKEN);
client.on('disconnect', () => {
    log.info('Bot has disconnected, logging back in');
    client.login(process.env.DISCORD_TOKEN);
    log.info('Bot has reconnected');
});
client.on('error', (error) => {
    log.error(`discord.js encountered an error: ${String(error)}`);
});

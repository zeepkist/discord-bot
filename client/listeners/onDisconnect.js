import { DISCORD_TOKEN } from '../../config/index.js';
import { log } from '../../utils/log.js';
export const onDisconnect = (client) => {
    log.warn('Bot has disconnected. Attempting to reconnect');
    client.login(DISCORD_TOKEN);
    log.info('Bot has reconnected');
};

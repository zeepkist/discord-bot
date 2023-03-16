import { log } from '../utils/index.js';
export const getChannelMessage = async (channel, messageId, options) => {
    let message;
    try {
        message = await channel.messages.fetch(messageId);
        return message;
    }
    catch (error) {
        if (error.message === 'Unknown Message') {
            log.error(`Message not found: ${messageId}. ${options ? 'Recreating' : 'Not recreating'}`);
            if (options) {
                message = await channel.send(options);
                return message;
            }
        }
    }
    return;
};

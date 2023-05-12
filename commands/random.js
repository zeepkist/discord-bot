import { getRandomLevels } from '@zeepkist/gtr-api';
import { ApplicationCommandType } from 'discord.js';
import { errorReply } from '../components/errorReply.js';
import { paginatedLevel } from '../components/paginated/paginatedLevel.js';
import { log } from '../utils/log.js';
export const random = {
    name: 'random',
    description: 'Get a random Zeepkist level',
    type: ApplicationCommandType.ChatInput,
    ephemeral: false,
    run: async (interaction) => {
        const levels = await getRandomLevels({
            Limit: 1
        });
        if (levels.levels.length === 0) {
            return errorReply(interaction, 'No levels found', 'We could not find any levels.');
        }
        const level = levels.levels[0];
        log.info(`Got random level ${level.id} (${level.name})`);
        await paginatedLevel({
            interaction,
            action: 'first',
            query: { id: level.id }
        });
        return;
    }
};

import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
import { errorReply } from '../components/errorReply.js';
import { paginatedRecent } from '../components/paginated/paginatedRecent.js';
import { log } from '../utils/index.js';
export const recent = {
    name: 'recent',
    description: 'Get recent personal bests and world records',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'world_records_only',
            description: 'Only show world records',
            type: ApplicationCommandOptionType.Boolean
        }
    ],
    ephemeral: false,
    run: async (interaction) => {
        try {
            await paginatedRecent({
                interaction,
                action: 'first',
                query: {
                    worldRecordsOnly: interaction.options.data.find(option => option.name === 'world_records_only')?.value
                }
            });
        }
        catch (error) {
            log.error(error);
            errorReply(interaction, recent.name, error);
        }
    }
};

import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
import { errorReply } from '../components/errorReply.js';
import { paginatedRecent } from '../components/paginated/paginatedRecent.js';
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
            errorReply(interaction, recent.name, error);
        }
    }
};

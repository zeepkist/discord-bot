import { ApplicationCommandType } from 'discord.js';
import { errorReply } from '../components/errorReply.js';
import { paginatedRankings } from '../components/paginated/paginatedRankings.js';
export const rankings = {
    name: 'rankings',
    description: 'Get user rankings',
    type: ApplicationCommandType.ChatInput,
    options: [],
    ephemeral: false,
    run: async (interaction) => {
        try {
            await paginatedRankings({
                interaction,
                action: 'first'
            });
        }
        catch (error) {
            errorReply(interaction, rankings.name, error);
        }
    }
};

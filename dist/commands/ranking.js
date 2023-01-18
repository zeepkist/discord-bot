import { ApplicationCommandType } from 'discord.js';
import { errorReply } from '../components/errorReply.js';
import { userRankings } from '../components/userRankings.js';
export const ranking = {
    name: 'ranking',
    description: 'Get user rankings',
    type: ApplicationCommandType.ChatInput,
    options: [],
    run: async (interaction) => {
        try {
            const { embeds, components } = await userRankings(interaction);
            interaction.reply({ embeds, components });
        }
        catch (error) {
            errorReply(interaction, ranking.name, error);
        }
    }
};

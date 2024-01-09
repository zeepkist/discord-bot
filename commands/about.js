import { ApplicationCommandType } from 'discord.js';
import { embed } from '../components/about.js';
export const about = {
    name: 'about',
    description: 'Useful information and how to support development',
    type: ApplicationCommandType.ChatInput,
    ephemeral: false,
    run: async (interaction) => {
        await interaction.editReply({
            embeds: [embed]
        });
    }
};

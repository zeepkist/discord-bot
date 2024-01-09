import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
export const playlist = {
    name: 'playlist',
    description: 'Placeholder',
    type: ApplicationCommandType.ChatInput,
    ephemeral: true,
    run: async (interaction) => {
        const embed = new EmbedBuilder()
            .setTitle('Placeholder')
            .setColor(0xff_92_00)
            .setDescription('Placeholder');
        await interaction.editReply({
            embeds: [embed]
        });
    }
};

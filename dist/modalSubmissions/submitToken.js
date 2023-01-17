import { EmbedBuilder } from 'discord.js';
export const submitToken = {
    name: 'submitTokenModal',
    run: async (interaction) => {
        const token = interaction.fields.getTextInputValue('token');
        console.log(token);
        const embed = new EmbedBuilder()
            .setTitle('Accounts Linked')
            .setDescription('Your Discord and Steam accounts have been linked. You can now use the `/user` command to view your stats!')
            .setColor('#00ff00')
            .setTimestamp();
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};

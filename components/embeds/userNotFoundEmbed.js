import { EmbedBuilder, hyperlink } from 'discord.js';
export const userNotFoundEmbed = (interaction, user) => {
    const modkistWiki = hyperlink('Modkist', 'https://zeepkist.fandom.com/wiki/Modkist_(Mod_Manager)');
    const embed = new EmbedBuilder()
        .setColor(0xff_92_00)
        .setTitle('User not found')
        .setDescription(`${user || 'User'} does not have Zeepkist GTR installed.\n\nGet the mod on ${modkistWiki}!`);
    interaction.editReply({ embeds: [embed] });
};

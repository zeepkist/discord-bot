import { EmbedBuilder, inlineCode } from 'discord.js'

export const alreadyLinkedReply = interaction => {
  const embed = new EmbedBuilder()
    .setTitle(`You're Already Linked!`)
    .setDescription(
      `Your Discord and Steam accounts are already linked.\n\nUse ${inlineCode(
        '/user'
      )} to view your stats.`
    )
    .setColor('#00ff00')
    .setTimestamp()
  interaction.reply({ embeds: [embed], ephemeral: true })
}

import {
  CommandInteraction,
  EmbedBuilder,
  inlineCode,
  ModalSubmitInteraction
} from 'discord.js'

export const alreadyLinkedReply = (
  interaction: CommandInteraction | ModalSubmitInteraction
): void => {
  const embed = new EmbedBuilder()
    .setTitle(`You're Already Linked!`)
    .setDescription(
      `Your Discord and Steam accounts are already linked.\n\n${inlineCode(
        '/user'
      )} will show your stats.\n\n${inlineCode(
        '/level'
      )} will show your PB next to medal times.`
    )
    .setColor('#00ff00')
    .setTimestamp()

  interaction.editReply({ embeds: [embed] })
}

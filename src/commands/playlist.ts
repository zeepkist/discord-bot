import { ApplicationCommandType, EmbedBuilder } from 'discord.js'

import { Command } from '../types/index.js'

export const playlist: Command = {
  name: 'playlist',
  description: 'Placeholder',
  type: ApplicationCommandType.ChatInput,
  ephemeral: true,
  run: async interaction => {
    const embed = new EmbedBuilder()
      .setTitle('Placeholder')
      .setColor(0xff_92_00)
      .setDescription('Placeholder')

    await interaction.editReply({
      embeds: [embed]
    })
  }
}

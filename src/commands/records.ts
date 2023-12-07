import { ApplicationCommandType, EmbedBuilder } from 'discord.js'

import { Command } from '../types/index.js'

export const records: Command = {
  name: 'records',
  description: 'Placeholder',
  type: ApplicationCommandType.ChatInput,
  ephemeral: false,
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

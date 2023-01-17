import { ApplicationCommandType, CommandInteraction } from 'discord.js'

import { Command } from '../command.js'
import { errorReply } from '../components/errorReply.js'
import { recentRecords } from '../components/recentRecords.js'

export const recent: Command = {
  name: 'recent',
  description: 'Get recent personal bests and world records',
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (interaction: CommandInteraction) => {
    try {
      const { embeds, components } = await recentRecords(interaction)
      interaction.reply({ embeds, components })
    } catch (error: unknown) {
      errorReply(interaction, recent.name, error)
    }
  }
}

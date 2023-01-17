import { ApplicationCommandType } from 'discord.js'

import { errorReply } from '../components/errorReply.js'
import { recentRecords } from '../components/recentRecords.js'

export const recent = {
  name: 'recent',
  description: 'Get recent personal bests and world records',
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async interaction => {
    try {
      const { embeds, components } = await recentRecords(interaction)
      interaction.reply({ embeds, components })
    } catch (error) {
      errorReply(interaction, recent.name, error)
    }
  }
}

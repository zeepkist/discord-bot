import { ApplicationCommandType, CommandInteraction } from 'discord.js'

import { Command } from '../command.js'
import { errorReply } from '../components/errorReply.js'
import { userRankings } from '../components/userRankings.js'

export const ranking: Command = {
  name: 'ranking',
  description: 'Get user rankings',
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (interaction: CommandInteraction) => {
    try {
      const { embeds, components } = await userRankings(interaction)
      interaction.reply({ embeds, components })
    } catch (error: unknown) {
      errorReply(interaction, ranking.name, error)
    }
  }
}

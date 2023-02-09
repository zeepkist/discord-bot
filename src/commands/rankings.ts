import { ApplicationCommandType, CommandInteraction } from 'discord.js'

import { Command } from '../command.js'
import { errorReply } from '../components/errorReply.js'
import { paginatedRankings } from '../components/paginated/paginatedRankings.js'

export const rankings: Command = {
  name: 'rankings',
  description: 'Get user rankings',
  type: ApplicationCommandType.ChatInput,
  options: [],
  ephemeral: false,
  run: async (interaction: CommandInteraction) => {
    try {
      await paginatedRankings({
        interaction,
        action: 'first'
      })
    } catch (error: unknown) {
      errorReply(interaction, rankings.name, error)
    }
  }
}

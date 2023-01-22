import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CommandInteraction
} from 'discord.js'

import { Command } from '../command.js'
import { errorReply } from '../components/errorReply.js'
import { paginatedRecent } from '../components/paginated/paginatedRecent.js'

export const recent: Command = {
  name: 'recent',
  description: 'Get recent personal bests and world records',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'world_records_only',
      description: 'Only show world records',
      type: ApplicationCommandOptionType.Boolean
    }
  ],
  run: async (interaction: CommandInteraction) => {
    try {
      await paginatedRecent({
        interaction,
        action: 'first',
        query: {
          worldRecordsOnly: interaction.options.data.find(
            option => option.name === 'world_records_only'
          )?.value as boolean
        }
      })
    } catch (error: unknown) {
      errorReply(interaction, recent.name, error)
    }
  }
}

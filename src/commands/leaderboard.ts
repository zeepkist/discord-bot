import { ApplicationCommandType } from 'discord.js'

import { createLeaderboard } from '../components/createLeaderboard.js'
import { PaginatedButtonActionEnum } from '../enums/index.js'
import { Command } from '../types/index.js'

export const leaderboard: Command = {
  name: 'leaderboard',
  description: 'View the Zeepkist GTR points leaderboard',
  type: ApplicationCommandType.ChatInput,
  ephemeral: false,
  run: async interaction => {
    await createLeaderboard({
      interaction,
      action: PaginatedButtonActionEnum.First
    })
  }
}

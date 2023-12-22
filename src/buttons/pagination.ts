import { ButtonInteraction } from 'discord.js'

import { createLeaderboard } from '../components/createLeaderboard.js'
import { createRecords } from '../components/createRecords.js'
import { PaginatedButtonTypeEnum } from '../enums/index.js'
import { PaginatedButton, PaginatedButtonAction } from '../types/index.js'
import { log } from '../utils/index.js'

export const pagination: PaginatedButton = {
  name: 'paginationButton',
  type: 'pagination',
  run: async (
    interaction: ButtonInteraction,
    command: string,
    action: PaginatedButtonAction
  ): Promise<void> => {
    switch (command) {
      case PaginatedButtonTypeEnum.Leaderboard: {
        await createLeaderboard({ interaction, action })
        break
      }
      case PaginatedButtonTypeEnum.Records: {
        await createRecords({ interaction, action })
        break
      }
      default: {
        log.error(`Unknown pagination button command: ${command}`)
        break
      }
    }
  }
}

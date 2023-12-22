import {
  ApplicationCommandOptionType,
  ApplicationCommandType
} from 'discord.js'

import { createRecords } from '../components/createRecords.js'
import { PaginatedButtonActionEnum } from '../enums/index.js'
import { Command } from '../types/index.js'

export const records: Command = {
  name: 'records',
  description: 'View recent World Records, Personal Bests other records',
  type: ApplicationCommandType.ChatInput,
  ephemeral: false,
  options: [
    {
      name: 'wr',
      description: 'View recent World Records',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: 'View recent records by a user',
          type: ApplicationCommandOptionType.User
        }
      ]
    },
    {
      name: 'pb',
      description: 'View recent Personal Bests',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: 'View recent records by a user',
          type: ApplicationCommandOptionType.User
        }
      ]
    },
    {
      name: 'all',
      description: 'View all recent records',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: 'View recent records by a user',
          type: ApplicationCommandOptionType.User
        }
      ]
    }
  ],
  run: async interaction => {
    await createRecords({
      interaction,
      action: PaginatedButtonActionEnum.First
    })
  }
}

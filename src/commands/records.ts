import {
  ApplicationCommandNonOptionsData,
  ApplicationCommandOptionType,
  ApplicationCommandType
} from 'discord.js'

import { createRecords } from '../components/createRecords.js'
import { PaginatedButtonActionEnum, RecordType } from '../enums/index.js'
import { Command } from '../types/index.js'

type SubcommandOptions = readonly ApplicationCommandNonOptionsData[]

const options: SubcommandOptions = [
  {
    name: 'user',
    description: 'View recent records by a user',
    type: ApplicationCommandOptionType.User
  }
]

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
      options
    },
    {
      name: 'pb',
      description: 'View recent Personal Bests',
      type: ApplicationCommandOptionType.Subcommand,
      options
    },
    {
      name: 'all',
      description: 'View all recent records',
      type: ApplicationCommandOptionType.Subcommand,
      options
    }
  ],
  run: async interaction => {
    const user = interaction.options.getUser('user')

    const subcommand = interaction.options.data.find(
      option => option.type === ApplicationCommandOptionType.Subcommand
    )?.name

    const recordType =
      subcommand === 'wr'
        ? RecordType.WorldRecord
        : subcommand === 'pb'
          ? RecordType.PersonalBest
          : RecordType.All

    await createRecords({
      interaction,
      action: PaginatedButtonActionEnum.First,
      query: {
        user,
        recordType
      }
    })
  }
}

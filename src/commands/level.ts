import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CommandInteraction,
  EmbedBuilder
} from 'discord.js'

import { Command } from '../command.js'
import { errorReply } from '../components/errorReply.js'
import { paginatedLevel } from '../components/paginated/paginatedLevel.js'
import { paginatedLevels } from '../components/paginated/paginatedLevels.js'
import { getLevels, searchLevels } from '../services/levels.js'
import { log } from '../utils/log.js'

const getOptions = (interaction: CommandInteraction) => {
  const id = interaction.options.data.find(option => option.name === 'id')
    ?.value as number
  const workshopId = interaction.options.data.find(
    option => option.name === 'workshopid'
  )?.value as string
  const author = interaction.options.data.find(
    option => option.name === 'author'
  )?.value as string
  const name = interaction.options.data.find(option => option.name === 'name')
    ?.value as string

  const search = interaction.options.data.find(
    option => option.name === 'search'
  )?.value as string

  return { id, workshopId, author, name, search }
}

const replyNoLevels = async (
  interaction: CommandInteraction,
  invalidArguments = false
) => {
  const embed = new EmbedBuilder()
    .setColor(0xff_00_00)
    .setTitle(invalidArguments ? 'Missing Arguments' : 'No level found')
    .setDescription(
      invalidArguments
        ? 'You must provide either a level ID, workshop ID, author or name of a level.'
        : 'No level found with the provided arguments.'
    )
    .setTimestamp()

  await interaction.reply({ embeds: [embed], ephemeral: true })
}

export const level: Command = {
  name: 'level',
  description: 'Get records for a level',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'search',
      description: 'Search for a level by name or author',
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: 'id',
      description: 'The id of the level',
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: 'workshopid',
      description: 'The workshop id of the level(s)',
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: 'author',
      description: 'The exact author of the level(s)',
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: 'name',
      description: 'The exact name of the level(s)',
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ],
  run: async (interaction: CommandInteraction) => {
    const { id, workshopId, author, name, search } = getOptions(interaction)
    log.info(interaction, `${id} ${workshopId} ${author} ${name} ${search}`)

    if (!id && !workshopId && !author && !name && !search) {
      log.info(interaction, 'No arguments provided')
      await replyNoLevels(interaction, true)
      return
    }

    try {
      const levels = await (search
        ? searchLevels({ Query: search, Limit: 1 })
        : getLevels({
            Id: id,
            WorkshopId: workshopId,
            Author: author,
            Name: name,
            Limit: 1
          }))

      if (levels.totalAmount === 0) {
        log.info(interaction, 'No levels found')
        await replyNoLevels(interaction)
        return
      }

      log.info(interaction, `Found ${levels.totalAmount} levels`)

      if (levels.totalAmount > 1 && !search) {
        await paginatedLevels({
          interaction,
          action: 'first',
          query: { id, workshopId, author, name }
        })
        return
      }

      if (levels.totalAmount === 1 || search) {
        await paginatedLevel({
          interaction,
          action: 'first',
          query: { id: levels.levels[0].id }
        })
      }
    } catch (error: unknown) {
      errorReply(interaction, level.name, error)
    }
  }
}

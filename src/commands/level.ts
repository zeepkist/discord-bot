import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CommandInteraction,
  EmbedBuilder
} from 'discord.js'

import { Command } from '../command.js'
import { errorReply } from '../components/errorReply.js'
import { levelRecords } from '../components/levelRecords.js'
import { paginatedLevels } from '../components/paginated/paginatedLevels.js'
import { getLevels } from '../services/levels.js'

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

  return { id, workshopId, author, name }
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
      description: 'The author of the level(s)',
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: 'name',
      description: 'The name of the level(s)',
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ],
  run: async (interaction: CommandInteraction) => {
    const { id, workshopId, author, name } = getOptions(interaction)
    console.log('[level]:', id, workshopId, author, name)

    if (!id && !workshopId && !author && !name) {
      console.log('[level]:', 'No arguments provided')
      await replyNoLevels(interaction, true)
      return
    }

    try {
      const levels = await getLevels({
        Id: id,
        WorkshopId: workshopId,
        Author: author,
        Name: name,
        Limit: 0
      })

      if (levels.totalAmount === 0) {
        console.log('[level]:', 'No level found', levels)
        await replyNoLevels(interaction)
        return
      }

      if (levels.totalAmount > 1) {
        console.log('[level]:', 'Found multiple levels', levels)
        await paginatedLevels({
          interaction,
          action: 'first',
          query: { id, workshopId, author, name }
        })
        return
      }

      if (levels.totalAmount === 1) {
        console.log('[level]:', 'Found 1 level', levels)
        const { embeds, components } = await levelRecords(
          interaction,
          levels.levels[0]
        )
        await interaction.reply({ embeds, components })
      }
    } catch (error: unknown) {
      errorReply(interaction, level.name, error)
    }
  }
}

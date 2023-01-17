import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CommandInteraction,
  EmbedBuilder
} from 'discord.js'

import { Command } from '../command.js'
import { errorReply } from '../components/errorReply.js'
import { levelRecords } from '../components/levelRecords.js'
import { levelsList } from '../components/levelsList.js'
import { getLevels } from '../services/levels.js'

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

    console.log('[level]:', id, workshopId, author, name)

    if (!id && !workshopId && !author && !name) {
      console.log('[level]:', 'No arguments provided')
      await interaction.reply({
        content:
          'You must provide either a level ID, workshop ID, author or name of a level.',
        ephemeral: true
      })
      return
    }

    try {
      const levels = await getLevels({
        Id: id,
        WorkshopId: workshopId,
        Author: author,
        Name: name,
        Limit: 10
      })

      if (levels.totalAmount === 0) {
        console.log('[level]:', 'No level found', levels)
        const embed = new EmbedBuilder()
          .setColor(0xff_00_00)
          .setTitle('No level found')
          .setDescription('No level found with the provided arguments.')
          .setTimestamp()

        await interaction.reply({ embeds: [embed], ephemeral: true })
        return
      }

      if (levels.totalAmount > 1) {
        console.log('[level]:', 'Found multiple levels', levels)
        const { embeds } = await levelsList(
          interaction,
          levels.levels,
          levels.totalAmount
        )

        await interaction.reply({ embeds })
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

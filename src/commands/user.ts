// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError } from 'axios'
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CommandInteraction,
  EmbedBuilder,
  inlineCode
} from 'discord.js'

import { Command } from '../command.js'
import { listRecords } from '../components/lists/listRecords.js'
import { database } from '../services/database.js'
import { getRecords } from '../services/records.js'
import { getUser } from '../services/users.js'

export const user: Command = {
  name: 'user',
  description: 'Get information about a user.',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'steamid',
      description: "User's Steam ID.",
      type: ApplicationCommandOptionType.String,
      required: false,
      minLength: 17,
      maxLength: 17
    },
    {
      name: 'id',
      description: "User's internal ID.",
      type: ApplicationCommandOptionType.String,
      required: false,
      minLength: 1
    }
  ],
  run: async (interaction: CommandInteraction) => {
    const user = await database('linked_accounts').select('steamId').where({
      discordId: interaction.user.id
    })
    let steamId = interaction.options.data.find(
      option => option.name === 'steamid'
    )?.value as string
    const id = interaction.options.data.find(option => option.name === 'id')
      ?.value as number

    if ((!user || user.length === 0) && !steamId && !id) {
      await interaction.reply({
        content: `You must provide either a Steam ID or a user ID.\n\nIf you link your Steam account with ${inlineCode(
          '/verify'
        )}, you can use this command without providing a Steam ID or user ID.`,
        ephemeral: true
      })
      return
    }

    if (!steamId && !id) {
      steamId = user[0].steamId
    }

    try {
      const user = await getUser({ steamId, id })
      const allValidRecords = await getRecords({
        UserSteamId: steamId,
        UserId: id,
        Sort: '-id',
        Limit: 5
      })
      const allInvalidRecords = await getRecords({
        UserSteamId: steamId,
        UserId: id,
        ValidOnly: false,
        Sort: '-id',
        Limit: 5
      })
      const bestRecords = await getRecords({
        UserSteamId: steamId,
        UserId: id,
        BestOnly: true,
        Sort: '-id',
        Limit: 5
      })
      const worldRecords = await getRecords({
        UserSteamId: steamId,
        UserId: id,
        WorldRecordOnly: true,
        Sort: '-id',
        Limit: 5
      })

      const totalRuns =
        allValidRecords.totalAmount + allInvalidRecords.totalAmount

      const embed = new EmbedBuilder()
        .setColor(0xff_92_00)
        .setTitle(`${user.steamName}'s Stats`)
        .setURL(`https://zeepkist.wopian.me/user/${user.steamId}`)
        .addFields(
          {
            name: 'World Records',
            value: String(worldRecords.totalAmount),
            inline: true
          },
          {
            name: 'Best Times',
            value: String(bestRecords.totalAmount),
            inline: true
          },
          {
            name: 'Total Runs',
            value: String(totalRuns),
            inline: true
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Data provided by Zeepkist GTR' })

      const worldRecordsList = listRecords({
        records: worldRecords.records,
        showLevel: true,
        showMedal: true
      })

      if (worldRecordsList.length > 0) {
        embed.addFields({
          name: 'Recent World Records',
          value: worldRecordsList
        })
      }

      const bestRecordsList = listRecords({
        records: bestRecords.records,
        showLevel: true,
        showMedal: true
      })

      if (bestRecordsList.length > 0) {
        embed.addFields({
          name: 'Recent Bests',
          value: bestRecordsList
        })
      }

      const anyPercentRecordsList = listRecords({
        records: allInvalidRecords.records,
        showLevel: true
      })

      if (anyPercentRecordsList.length > 0) {
        embed.addFields({
          name: 'Recent any% Runs',
          value: anyPercentRecordsList
        })
      }

      await interaction.reply({
        embeds: [embed]
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: AxiosError | any) {
      console.error(String(error))
      await (error.response?.status === 404
        ? interaction.reply({
            ephemeral: true,
            content: 'User not found.'
          })
        : interaction.reply({
            ephemeral: true,
            content:
              'An error occurred while fetching user data. Please try again later.'
          }))
    }
  }
}

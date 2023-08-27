import {
  getUser,
  getUserByDiscordId,
  getUserBySteamId
} from '@zeepkist/gtr-api'
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CommandInteraction
} from 'discord.js'

import { Command } from '../command.js'
import { userEmbed } from '../components/embeds/userEmbed.js'
import { userNotFoundEmbed } from '../components/embeds/userNotFoundEmbed.js'
import { log } from '../utils/index.js'

export const user: Command = {
  name: 'user',
  description: 'Get information about a user.',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'user',
      description: 'Discord User',
      type: ApplicationCommandOptionType.User,
      required: false
    },
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
      minLength: 0
    },
    {
      name: 'page',
      description: 'Select the page to show',
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        {
          name: 'Stats',
          value: 'stats'
        },
        {
          name: 'Records',
          value: 'records'
        }
      ]
    }
  ],
  ephemeral: false,
  run: async (interaction: CommandInteraction) => {
    let discordUser = interaction.options.data.find(
      option => option.name === 'user'
    )?.user

    const steamId = interaction.options.data.find(
      option => option.name === 'steamid'
    )?.value as string

    const id = interaction.options.data.find(option => option.name === 'id')
      ?.value as number

    const page = interaction.options.data.find(option => option.name === 'page')
      ?.value as string

    log.info(
      `Discord ID: ${discordUser?.id}, Steam ID: ${steamId}, ID: ${id}, Page: ${page}`,
      interaction
    )

    if (!discordUser?.id && !steamId && !id) {
      discordUser = interaction.user
    }

    try {
      const user = discordUser?.id
        ? await getUserByDiscordId(discordUser.id)
        : steamId
        ? await getUserBySteamId(steamId)
        : await getUser(id)
      log.info(`Found user: ${user.steamName}`, interaction)
      await userEmbed(interaction, user, discordUser, page)
    } catch (error) {
      log.error(String(error), interaction)
      userNotFoundEmbed(interaction)
    }
  }
}

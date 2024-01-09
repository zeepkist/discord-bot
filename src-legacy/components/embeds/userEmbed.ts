import { User } from '@zeepkist/gtr-api'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  User as DiscordUser
} from 'discord.js'
import { HTTPError } from 'ky'

import { STEAM_URL, ZEEPKIST_URL } from '../../constants.js'
import { getPlayerSummaries } from '../../services/steam.js'
import { log } from '../../utils/index.js'
import { userEmbedRecords } from './user/records.js'
import { userEmbedStats } from './user/stats.js'

const addDiscordAuthor = (
  interaction: CommandInteraction,
  embed: EmbedBuilder,
  linkedAccount: DiscordUser,
  steamId: string
) => {
  log.info(`Adding Discord author: ${linkedAccount.tag}`, interaction)
  embed.setAuthor({
    name: linkedAccount.username,
    iconURL: linkedAccount.avatarURL() ?? '',
    url: `${ZEEPKIST_URL}/user/${steamId}`
  })
  if (linkedAccount.hexAccentColor) {
    embed.setColor(linkedAccount.hexAccentColor)
  }
}

export const userEmbed = async (
  interaction: CommandInteraction,
  user: User,
  discordUser?: DiscordUser,
  page = 'records'
) => {
  try {
    const embed = new EmbedBuilder()
      .setColor(0xff_92_00)
      .setTitle(user.steamName)
      .setURL(`${ZEEPKIST_URL}/user/${user.steamId}`)
      .setTimestamp()
      .setFooter({ text: 'Data provided by Zeepkist GTR' })
    log.info('Created embed.', interaction)

    try {
      const steamPlayerSummary = await getPlayerSummaries([user.steamId])
      const steamUser = steamPlayerSummary.response.players[0]
      log.info(
        `Found Steam player summary. Private: ${
          steamUser.communityvisibilitystate === 1
        }`,
        interaction
      )

      embed.setThumbnail(steamUser.avatarfull)
    } catch (error) {
      log.error(
        `Failed to get Steam player summary - ${String(error)}`,
        interaction
      )
    }

    if (user.discordId) {
      addDiscordAuthor(
        interaction,
        embed,
        discordUser || interaction.user,
        user.steamId
      )
    }

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Zeepki.st Profile')
        .setURL(`${ZEEPKIST_URL}/user/${user.steamId}`),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Steam Profile')
        .setURL(`${STEAM_URL}/profiles/${user.steamId}`)
    ])

    if (page === 'stats') {
      await userEmbedStats(interaction, user, embed)
    } else if (page === 'records') {
      await userEmbedRecords(interaction, user, embed)
    }

    log.info(`Sending message`, interaction)

    await interaction.editReply({
      embeds: [embed],
      components: [buttons]
    })
  } catch (error) {
    const embed = new EmbedBuilder()
      .setColor(0xff_00_00)
      .setTitle('Error')
      .setDescription(
        'An error occurred while fetching user data. Please try again later.'
      )

    if (error instanceof HTTPError) {
      log.error(`${error.response.status} - ${error.response.statusText}`)
      if ([404, 422].includes(error.response?.status)) {
        embed
          .setColor(0xff_92_00)
          .setTitle('User not found')
          .setDescription(
            'The user you are trying to find does not have the Zeepkist GTR mod installed.'
          )
      }
    } else {
      log.error(String(error))
    }

    interaction.editReply({
      embeds: [embed]
    })
  }
}

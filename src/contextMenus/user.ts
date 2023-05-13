import { getUserByDiscordId } from '@zeepkist/gtr-api'
import { ApplicationCommandType } from 'discord.js'

import { userEmbed } from '../components/embeds/userEmbed.js'
import { userNotFoundEmbed } from '../components/embeds/userNotFoundEmbed.js'
import { ContextMenu } from '../contextMenu.js'
import { log } from '../utils/log.js'

export const user: ContextMenu = {
  name: 'Zeepkist Profile',
  type: ApplicationCommandType.User,
  ephemeral: true,
  run: async (interaction, discordUser) => {
    if (!discordUser) return userNotFoundEmbed(interaction)

    try {
      const user = await getUserByDiscordId(discordUser.id)
      if (!user) return userNotFoundEmbed(interaction, discordUser)

      log.info(`Found user: ${user.steamName}`, interaction)
      await userEmbed(interaction, user, discordUser)
    } catch (error) {
      log.error(String(error), interaction)
      return userNotFoundEmbed(interaction, discordUser)
    }
  }
}

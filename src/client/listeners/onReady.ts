import { ActivityType, Client } from 'discord.js'

import { createCommands } from '../../commands/createCommands.js'
import { ZEEPKIST_URL } from '../../config/index.js'
import { createContextMenus } from '../../contextMenus/createContextMenus.js'
import { log } from '../../utils/log.js'

export const onReady = async (client: Client) => {
  if (!client.user || !client.application) return

  const commands = createCommands()
  const contextMenus = createContextMenus()

  await client.application.commands.set([...commands, ...contextMenus])

  client.user?.setPresence({
    activities: [
      {
        type: ActivityType.Watching,
        name: 'Zeepkist',
        url: ZEEPKIST_URL
      }
    ],
    status: 'online'
  })

  log.info(
    `${client.user.username} is online and listening to ${client.guilds.cache.size} servers:`
  )

  for (const [, guild] of client.guilds.cache) {
    log.info(` - ${guild.name} (${guild.id})`)
  }
}

import { ActivityType, Client } from 'discord.js'

import { commands } from '../commands.js'
import { ZEEPKIST_URL } from '../constants.js'
import { contextMenus } from '../contextMenus.js'
import { log } from '../utils/index.js'

export default async (client: Client) => {
  if (!client.user || !client.application) return
  await client.application.commands.set([...commands, ...contextMenus])

  log.info(`${client.user.username} is online!`)

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
}

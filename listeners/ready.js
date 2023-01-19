import { ActivityType } from 'discord.js'

import { commands } from '../commands.js'

export default async client => {
  if (!client.user || !client.application) return
  await client.application.commands.set(commands)
  console.log(`${client.user.username} is online!`)
  client.user?.setPresence({
    activities: [
      {
        type: ActivityType.Watching,
        name: 'Zeepkist',
        url: 'https://zeepkist.wopian.me'
      }
    ],
    status: 'online'
  })
}

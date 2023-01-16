import { Client } from 'discord.js'

import { commands } from '../commands.js'

export default async (client: Client) => {
  if (!client.user || !client.application) return
  await client.application.commands.set(commands)
  console.log(`${client.user.username} is online!`)
}

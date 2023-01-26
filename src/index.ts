import { Client, Events, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'

import interactionCreate from './listeners/interactionCreate.js'
import ready from './listeners/ready.js'

config()

console.log('Bot is starting...')

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

client.once(Events.ClientReady, ready)
interactionCreate(client)

client.login(process.env.DISCORD_TOKEN)

client.on('disconnect', () => {
  console.log('Bot is disconnecting...')
  client.login(process.env.DISCORD_TOKEN)
})

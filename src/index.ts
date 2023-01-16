import { Client, Events, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import interactionCreate from './listeners/interactionCreate.js'
import ready from './listeners/ready.js'

config()

console.log('Bot is starting...')

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

client.on(Events.ClientReady, ready)
interactionCreate(client)

client.login(process.env.DISCORD_TOKEN)

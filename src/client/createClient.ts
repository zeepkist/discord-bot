import { Client, Events, GatewayIntentBits } from 'discord.js'

import { DISCORD_TOKEN } from '../config/index.js'
import {
  onDisconnect,
  onError,
  onInteractionCreate,
  onReady
} from './listeners/index.js'

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

client.once(Events.ClientReady, onReady)

client.on(Events.InteractionCreate, onInteractionCreate)

client.on(Events.Error, onError)

client.on('disconnect', () => onDisconnect(client))

console.log('Logging in', DISCORD_TOKEN)

client.login(DISCORD_TOKEN)

export const createClient = (): Client => client

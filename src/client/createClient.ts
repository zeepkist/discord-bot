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

client.on(Events.Warn, console.warn)

client.on(Events.ShardReconnecting, () => console.log('Reconnecting...'))

client.on(Events.ShardResume, (shardId, replayed) =>
  console.log(`Resumed Shard ${shardId} | Replayed ${replayed} events.`)
)

client.on(Events.Invalidated, () => console.log('Invalidated'))

client.on(Events.Debug, console.log)

client.on(Events.ShardDisconnect, console.log)

client.on(Events.ShardError, console.log)

client.on(Events.ShardReady, console.log)

client.on('disconnect', () => onDisconnect(client))

console.log('Logging in', DISCORD_TOKEN)

client.login(DISCORD_TOKEN)

export const createClient = (): Client => client

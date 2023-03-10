import 'dotenv/config'

import { ApiClient } from '@twurple/api'
import { AppTokenAuthProvider } from '@twurple/auth'
import { subHours, subMonths } from 'date-fns'
import { Client, Message, TextChannel } from 'discord.js'

import { twitchComponent } from '../components/twitch/component.js'
import { twitchEmbed } from '../components/twitch/embed.js'
import { database } from '../services/database.js'

interface KnownStream {
  messageId: Message['id']
  streamId: string
  userId: string
  userName: string
  viewers: number
  createdAt: Date
  updatedAt: Date
  isLive: boolean
}

const CLIENT_ID = process.env.TWITCH_ID as string
const CLIENT_SECRET = process.env.TWITCH_SECRET as string
const GUILD = process.env.DISCORD_ZEEPKIST_GUILD as string
const CHANNEL = process.env.DISCORD_ZEEPKIST_CHANNEL as string

const authProvider = new AppTokenAuthProvider(CLIENT_ID, CLIENT_SECRET)
const apiClient = new ApiClient({ authProvider })

// Get all known live streams from the database that are younger than 6 hours
const knownStreams: KnownStream[] = await database('twitch_streams')
  .where('isLive', true)
  .where('createdAt', '>', subHours(Date.now(), 6))

console.log(knownStreams)

async function getGames() {
  const game = await apiClient.games.getGameByName('Zeepkist')
  if (!game) return []

  const request = game.getStreamsPaginated()

  let page
  const result = []

  while ((page = await request.getNext()).length > 0) {
    result.push(...page)
  }

  return result
}

async function isStreamLive(userName: string) {
  const user = await apiClient.users.getUserByName(userName)
  if (!user) return false

  const stream = await apiClient.streams.getStreamByUserId(user.id)
  return !!stream
}

async function cleanupOldStreams() {
  for await (const knownStream of knownStreams) {
    const seconds = (Date.now() - knownStream.createdAt.getTime()) / 1000
    if (
      (!(await isStreamLive(knownStream.userName)) && seconds > 60 * 60) || // 1 hour
      seconds > 60 * 60 * 12 // 12 hours
    ) {
      //remove when offline or 12 hours old
      console.log('Trying to remove stream from ' + knownStream.userName)
      for (let index = knownStreams.length - 1; index >= 0; index--) {
        if (knownStreams[index].userId == knownStream.userId) {
          knownStreams.splice(index, 1)

          // Update the database
          await database('twitch_streams')
            .where('messageId', knownStream.messageId)
            .update('isLive', false)

          console.log('Removed stream from ' + knownStream.userName)
        }
      }
    }
  }
}

const getMonthlyStreams = async (userId: string) => {
  const response = await database('twitch_streams')
    .where('userId', userId)
    .where('createdAt', '>', subMonths(Date.now(), 1))
    .count({ count: 'userId' })
    .first()

  return Number(response?.count ?? 0)
}

async function announceStreams(client: Client) {
  const guild = await client.guilds.fetch(GUILD) // Zeepkist
  const channel = await guild.channels.fetch(CHANNEL) // zeep-streams

  if (!guild || !channel) return // Bot is not in the server
  if (!(channel instanceof TextChannel)) return // Channel is not a text channel

  const games = await getGames()

  for (const stream of games) {
    const streamsThisMonth = await getMonthlyStreams(stream.userId)
    const embed = twitchEmbed(stream, streamsThisMonth)
    const component = twitchComponent(stream)

    if (knownStreams.some(item => item.userName === stream.userName)) {
      const data = knownStreams.find(item => item.userName === stream.userName)
      if (data === undefined) return

      if (data.messageId != undefined && data.viewers != stream.viewers) {
        const message = await channel.messages.fetch(data.messageId)
        if (message == undefined) {
          console.log('Message not found: ' + data.messageId)
        } else {
          message.edit({ embeds: [embed], components: [component] })
        }
      }
    } else {
      console.log(
        stream.userDisplayName +
          ' is playing ' +
          stream.gameName +
          ' with ' +
          stream.viewers +
          ' viewers on https://twitch.tv/' +
          stream.userName
      )

      const message = await channel.send({
        embeds: [embed],
        components: [component]
      })

      const streamData: KnownStream = {
        isLive: true,
        streamId: stream.id,
        messageId: message.id,
        createdAt: stream.startDate,
        updatedAt: new Date(Date.now()),
        userId: stream.userId,
        userName: stream.userName,
        viewers: stream.viewers
      }

      await database('twitch_streams').insert(streamData)
      knownStreams.push(streamData)
      console.log('Added ' + stream.userName + ' to known streams')
    }
  }
}

export const twitchStreams = async (client: Client) => {
  await announceStreams(client)

  setInterval(async () => {
    await announceStreams(client)
    cleanupOldStreams()
  }, 1000 * 60 * 5) // 5 minutes
}

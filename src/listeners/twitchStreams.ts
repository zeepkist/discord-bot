import 'dotenv/config'

import { ApiClient } from '@twurple/api'
import { AppTokenAuthProvider } from '@twurple/auth'
import { subHours, subMonths } from 'date-fns'
import { Client, TextChannel } from 'discord.js'

import { twitchComponent } from '../components/twitch/component.js'
import { twitchEmbed } from '../components/twitch/embed.js'
import { twitchEmbedEnded } from '../components/twitch/embedEnded.js'
import { DatabaseStream } from '../models/twitch.js'
import { database } from '../services/database.js'
import { log } from '../utils/index.js'

const CLIENT_ID = process.env.TWITCH_ID as string
const CLIENT_SECRET = process.env.TWITCH_SECRET as string
const GUILD = process.env.DISCORD_ZEEPKIST_GUILD as string
const CHANNEL = process.env.DISCORD_ZEEPKIST_CHANNEL as string

const authProvider = new AppTokenAuthProvider(CLIENT_ID, CLIENT_SECRET)
const apiClient = new ApiClient({ authProvider })

// Get all known live streams from the database that are younger than 6 hours
const knownStreams: DatabaseStream[] = await database('twitch_streams')
  .where('isLive', true)
  .where('createdAt', '>', subHours(Date.now(), 6))

log.info(`${knownStreams.length} known live streams found`)

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

async function cleanupOldStreams(channel: TextChannel) {
  for await (const knownStream of knownStreams) {
    const seconds = (Date.now() - knownStream.createdAt.getTime()) / 1000
    if (
      (!(await isStreamLive(knownStream.userName)) && seconds > 60 * 60) || // 1 hour
      seconds > 60 * 60 * 12 // 12 hours
    ) {
      //remove when offline or 12 hours old
      log.info(`Setting ${knownStream.userName}'s stream to offline`)
      for (let index = knownStreams.length - 1; index >= 0; index--) {
        if (knownStreams[index].userId == knownStream.userId) {
          knownStreams.splice(index, 1)

          // Update the database
          await database('twitch_streams')
            .where('messageId', knownStream.messageId)
            .update({
              isLive: false,
              updatedAt: new Date(Date.now())
            })

          // Get the latest stream data from the database
          const stream: DatabaseStream = await database('twitch_streams')
            .where('messageId', knownStream.messageId)
            .first()

          // Remove button
          const message = await channel.messages.fetch(knownStream.messageId)
          if (message == undefined) {
            log.error(`Message not found: ${knownStream.messageId}`)
          } else {
            const embed = twitchEmbedEnded(stream)
            message.edit({ embeds: [embed], components: [] })
          }

          log.info(`Set ${knownStream.userName}'s stream to offline`)
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

async function announceStreams(channel: TextChannel) {
  const games = await getGames()

  for (const stream of games) {
    const streamsThisMonth = await getMonthlyStreams(stream.userId)
    const component = twitchComponent(stream)
    const user = await stream.getUser()
    const profilePictureUrl =
      user?.profilePictureUrl ??
      'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-twitch/contentbuilder/community-meetups_event-thumbnail_400x400.png'

    if (knownStreams.some(item => item.userName === stream.userName)) {
      const data = knownStreams.find(item => item.userName === stream.userName)
      if (data === undefined) return

      if (data.messageId != undefined && data.viewers != stream.viewers) {
        const embed = await twitchEmbed(
          stream,
          streamsThisMonth,
          profilePictureUrl
        )
        const message = await channel.messages.fetch(data.messageId)
        if (message == undefined) {
          log.error(`Message not found: ${data.messageId}`)
        } else {
          await database('twitch_streams')
            .where('messageId', data.messageId)
            .update({
              viewers: stream.viewers,
              peakViewers: Math.max(stream.viewers, data.peakViewers),
              updatedAt: new Date(Date.now())
            })

          message.edit({ embeds: [embed], components: [component] })

          log.info(`Updated ${stream.userName}'s stream`)
        }
      }
    } else {
      const embed = await twitchEmbed(
        stream,
        streamsThisMonth + 1, // +1 because this is a stream that is not yet in the database
        profilePictureUrl
      )

      const message = await channel.send({
        embeds: [embed],
        components: [component]
      })

      const streamData: DatabaseStream = {
        isLive: true,
        streamId: stream.id,
        messageId: message.id,
        createdAt: stream.startDate,
        updatedAt: new Date(Date.now()),
        userId: stream.userId,
        userName: stream.userName,
        profilePictureUrl,
        viewers: stream.viewers,
        peakViewers: stream.viewers
      }

      await database('twitch_streams').insert(streamData)
      knownStreams.push(streamData)

      log.info(`Announced ${stream.userName}'s stream`)
    }
  }
}

export const twitchStreams = async (client: Client) => {
  const guild = await client.guilds.fetch(GUILD) // Zeepkist
  const channel = await guild.channels.fetch(CHANNEL) // zeep-streams

  if (!guild || !channel) return // Bot is not in the server
  if (!(channel instanceof TextChannel)) return // Channel is not a text channel

  await announceStreams(channel)

  setInterval(async () => {
    await announceStreams(channel)
    cleanupOldStreams(channel)
  }, 1000 * 60 * 5) // 5 minutes
}

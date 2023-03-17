import 'dotenv/config'

import { addHours, addMinutes } from 'date-fns'
import { Client, TextChannel } from 'discord.js'

import { getChannelMessage } from '../components/getChannelMessage.js'
import { twitchComponent } from '../components/twitch/component.js'
import { twitchEmbed } from '../components/twitch/embed.js'
import { twitchEmbedEnded } from '../components/twitch/embedEnded.js'
import { twitchStatsEmbed } from '../components/twitch/statsEmbed.js'
import { DatabaseStream } from '../models/twitch.js'
import {
  addStream,
  getLiveStreams,
  getMonthlyStats,
  getMonthlyUserStreams,
  updateStream
} from '../services/database/twitchStreams.js'
import { getStreams, isStreamLive } from '../services/twitch.js'
import { log } from '../utils/index.js'

const GUILD = process.env.DISCORD_ZEEPKIST_GUILD as string
const CHANNEL = process.env.DISCORD_ZEEPKIST_CHANNEL as string

// Get all known live streams from the database
const knownStreams = await getLiveStreams()
log.info(`Found ${knownStreams.length} live livestreams in the database.`)

async function cleanupOldStreams(channel: TextChannel) {
  log.info('Cleaning up old streams')

  for (let index = knownStreams.length - 1; index >= 0; index--) {
    const knownStream = knownStreams[index]

    // Check if the stream is still live. If it is, skip it
    if (await isStreamLive(knownStream.userId)) continue

    log.info(`Setting ${knownStream.userName}'s stream to offline`)
    knownStreams.splice(index, 1)

    const streamData = await updateStream(
      knownStream.messageId,
      {
        isLive: false
      },
      true
    )
    if (!streamData) continue

    const message = await getChannelMessage(channel, knownStream.messageId)
    if (!message) continue

    const embed = twitchEmbedEnded(streamData)
    message.edit({ embeds: [embed], components: [] })

    log.info(`Set ${knownStream.userName}'s stream to offline`)
  }
}

async function announceStreams(channel: TextChannel) {
  const streams = await getStreams()

  for (const stream of streams) {
    const streamsThisMonth = await getMonthlyUserStreams(stream.userId)
    const component = twitchComponent(stream)
    const user = await stream.getUser()
    const profilePictureUrl =
      user?.profilePictureUrl ??
      'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-twitch/contentbuilder/community-meetups_event-thumbnail_400x400.png'

    const knownStream = knownStreams.find(item => item.userId === stream.userId)

    // If the stream is already known, update it
    if (knownStream) {
      if (!knownStream.messageId) return

      const embed = await twitchEmbed(
        stream,
        streamsThisMonth,
        profilePictureUrl
      )

      const message = await getChannelMessage(channel, knownStream.messageId, {
        embeds: [embed],
        components: [component]
      })
      if (!message) return

      await updateStream(knownStream.messageId, {
        messageId: message.id,
        viewers: stream.viewers,
        peakViewers: Math.max(stream.viewers, knownStream.peakViewers)
      })

      // Update the known stream with the new message id if it has changed (e.g if the message was deleted)
      knownStream.messageId = message.id

      message.edit({ embeds: [embed], components: [component] })

      log.info(`Updated ${stream.userName}'s stream`)
    } else {
      // If the stream is not known, announce it
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

      await addStream(streamData)
      knownStreams.push(streamData)

      log.info(`Announced ${stream.userName}'s stream`)
    }
  }
}

async function sendMonthlyStats(channel: TextChannel) {
  const data = await getMonthlyStats()
  if (!data) return

  const embed = twitchStatsEmbed(data)
  await channel.send({ embeds: [embed] })
  log.info('Sent stats message')
}

export const twitchStreams = async (client: Client) => {
  const guild = await client.guilds.fetch(GUILD) // Zeepkist
  const channel = await guild.channels.fetch(CHANNEL) // zeep-streams

  if (!guild || !channel) return // Bot is not in the server
  if (!(channel instanceof TextChannel)) return // Channel is not a text channel

  announceStreams(channel)
  sendMonthlyStats(channel)

  setInterval(async () => {
    await announceStreams(channel)
    cleanupOldStreams(channel)
  }, addMinutes(0, 5).getTime())

  setInterval(async () => {
    sendMonthlyStats(channel)
  }, addHours(0, 6).getTime())
}

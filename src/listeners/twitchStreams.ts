import 'dotenv/config'

import { addHours, addMinutes, isFirstDayOfMonth, subMonths } from 'date-fns'
import { Client, TextChannel } from 'discord.js'

import { getChannelMessage } from '../components/getChannelMessage.js'
import { twitchComponent } from '../components/twitch/component.js'
import { twitchEmbed } from '../components/twitch/embed.js'
import { twitchEmbedEnded } from '../components/twitch/embedEnded.js'
import { twitchStatsEmbed } from '../components/twitch/statsEmbed.js'
import { DatabaseStream, TwitchStats } from '../models/twitch.js'
import { database } from '../services/database.js'
import { getStreams, isStreamLive } from '../services/twitch.js'
import { log } from '../utils/index.js'

const GUILD = process.env.DISCORD_ZEEPKIST_GUILD as string
const CHANNEL = process.env.DISCORD_ZEEPKIST_CHANNEL as string

// Get all known live streams from the database
const knownStreams: DatabaseStream[] = await database('twitch_streams').where(
  'isLive',
  true
)

log.info(`${knownStreams.length} known live streams found`)

const getMonthlyStreams = async (userId: string) => {
  const response = await database('twitch_streams')
    .where('userId', userId)
    .where('createdAt', '>', subMonths(Date.now(), 1))
    .count({ count: 'userId' })
    .first()

  return Number(response?.count ?? 0)
}

async function cleanupOldStreams(channel: TextChannel) {
  for await (const knownStream of knownStreams) {
    if (!(await isStreamLive(knownStream.userId))) {
      //remove when offline
      log.info(`Setting ${knownStream.userName}'s stream to offline`)
      for (let index = knownStreams.length - 1; index >= 0; index--) {
        if (knownStreams[index].userId === knownStream.userId) {
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
          const message = await getChannelMessage(
            channel,
            knownStream.messageId
          )
          if (message === undefined) continue

          const embed = twitchEmbedEnded(stream)
          message.edit({ embeds: [embed], components: [] })
          log.info(`Set ${knownStream.userName}'s stream to offline`)
        }
      }
    }
  }
}

async function announceStreams(channel: TextChannel) {
  const streams = await getStreams()

  for (const stream of streams) {
    const streamsThisMonth = await getMonthlyStreams(stream.userId)
    const component = twitchComponent(stream)
    const user = await stream.getUser()
    const profilePictureUrl =
      user?.profilePictureUrl ??
      'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-twitch/contentbuilder/community-meetups_event-thumbnail_400x400.png'

    const knownStream = knownStreams.find(item => item.userId === stream.userId)

    // If the stream is already known, update it
    if (knownStream) {
      if (knownStream.messageId === undefined) return

      const embed = await twitchEmbed(
        stream,
        streamsThisMonth,
        profilePictureUrl
      )
      const message = await getChannelMessage(channel, knownStream.messageId, {
        embeds: [embed],
        components: [component]
      })
      if (message === undefined) return

      // If the message was recreated, update the database
      if (message.id !== knownStream.messageId) {
        log.info(`Changing message ${knownStream.messageId} to ${message.id}`)
        await database('twitch_streams')
          .where('messageId', knownStream.messageId)
          .update({
            messageId: message.id
          })
      }

      if (message) {
        await database('twitch_streams')
          .where('messageId', knownStream.messageId)
          .update({
            viewers: stream.viewers,
            peakViewers: Math.max(stream.viewers, knownStream.peakViewers),
            updatedAt: new Date(Date.now())
          })

        message.edit({ embeds: [embed], components: [component] })

        log.info(`Updated ${stream.userName}'s stream`)
      }
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

      await database('twitch_streams').insert(streamData)
      knownStreams.push(streamData)

      log.info(`Announced ${stream.userName}'s stream`)
    }
  }
}

async function getLastMonthlyStats(channel: TextChannel) {
  const oneMonthAgo = subMonths(Date.now(), 1)

  // See if we have stats for this month
  const response = await database('twitch_stats')
    .where('createdAt', '>', oneMonthAgo)
    .first()

  // We either have stats or it's not the first day of the month. So we don't need to create stats
  if (response || !isFirstDayOfMonth(Date.now())) return

  log.info('Creating monthly stats')

  const stats = await database('twitch_streams')
    .select(
      database.raw('COUNT(DISTINCT streamId) as totalStreams'),
      database.raw('COUNT(DISTINCT userId) as totalStreamers'),
      database.raw('AVG(viewers) as averageViewers'),
      database.raw('SUM(viewers) as totalViewers')
    )
    .where('createdAt', '>', oneMonthAgo)
    .first()

  const mostDailyViewers = await database('twitch_streams')
    .select(
      database.raw('DAY(createdAt) as day'),
      database.raw('SUM(viewers) as totalViewers')
    )
    .where('createdAt', '>', oneMonthAgo)
    .groupBy('day')
    .orderBy('totalViewers', 'desc')
    .first()

  const mostStreams = await database('twitch_streams')
    .select('userName', database.raw('COUNT(DISTINCT streamId) as value'))
    .where('createdAt', '>', oneMonthAgo)
    .groupBy('userId')
    .orderBy('value', 'desc')
    .first()

  const peakViewers = await database('twitch_streams')
    .select('userName', database.raw('MAX(peakViewers) as value'))
    .where('createdAt', '>', oneMonthAgo)
    .groupBy('userId')
    .orderBy('value', 'desc')
    .first()

  const averageViewers = await database('twitch_streams')
    .select('userName', database.raw('AVG(viewers) as value'))
    .where('createdAt', '>', oneMonthAgo)
    .groupBy('userId')
    .orderBy('value', 'desc')
    .first()

  log.info('Gathered stats')

  const data: TwitchStats = {
    totalStreams: stats.totalStreams,
    totalStreamers: stats.totalStreamers,
    totalViewers: stats.totalViewers,
    mostDailyViewers: mostDailyViewers.totalViewers,
    mostDailyViewersDay: mostDailyViewers.day,
    averageViewers: Math.floor(stats.averageViewers),
    averageStreamsStreamer: Math.floor(
      stats.totalStreams / stats.totalStreamers
    ),
    streamerMostStreamsUserName: mostStreams.userName,
    streamerMostStreamsValue: mostStreams.value,
    streamerPeakViewersUserName: peakViewers.userName,
    streamerPeakViewersValue: peakViewers.value,
    streamerAverageViewersUserName: averageViewers.userName,
    streamerAverageViewersValue: Math.floor(averageViewers.value)
  }

  const embed = twitchStatsEmbed(data)

  await channel.send({ embeds: [embed] })

  log.info('Sent stats message')

  await database('twitch_stats').insert(data)

  log.info('Saved stats')
}

export const twitchStreams = async (client: Client) => {
  const guild = await client.guilds.fetch(GUILD) // Zeepkist
  const channel = await guild.channels.fetch(CHANNEL) // zeep-streams

  if (!guild || !channel) return // Bot is not in the server
  if (!(channel instanceof TextChannel)) return // Channel is not a text channel

  announceStreams(channel)
  getLastMonthlyStats(channel)

  setInterval(async () => {
    await announceStreams(channel)
    cleanupOldStreams(channel)
  }, addMinutes(0, 5).getTime())

  setInterval(async () => {
    getLastMonthlyStats(channel)
  }, addHours(0, 6).getTime())
}

import { HelixStream } from '@twurple/api'
import { ActionRowBuilder, ButtonBuilder, Message } from 'discord.js'

export interface DatabaseStream {
  messageId: Message['id']
  streamId: string
  userId: string
  userName: string
  profilePictureUrl: string
  viewers: number
  peakViewers: number
  createdAt: Date
  updatedAt: Date
  isLive: boolean
}

export interface TwitchStats {
  totalStreams: number
  totalStreamers: number
  totalViewers: number
  mostDailyViewers: number
  mostDailyViewersDay: number
  averageViewers: number
  averageStreamsStreamer: number
  streamerMostStreamsUserName: string
  streamerMostStreamsValue: number
  streamerPeakViewersUserName: string
  streamerPeakViewersValue: number
  streamerAverageViewersUserName: string
  streamerAverageViewersValue: number
}

export interface TwitchUserStats {
  userName: string
  value: number
}

export interface CreateUpdateStreamOptions {
  component: ActionRowBuilder<ButtonBuilder>
  stream: HelixStream
  streamsThisMonth: number
  profilePictureUrl: string
}

import { Message } from 'discord.js'

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

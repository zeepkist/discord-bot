import { Message, MessageCreateOptions, TextChannel } from 'discord.js'

import { log } from '../utils/index.js'

export const getChannelMessage = async (
  channel: TextChannel,
  messageId: Message['id'],
  options?: MessageCreateOptions
): Promise<Message | undefined> => {
  let message: Message
  try {
    message = await channel.messages.fetch(messageId)
    return message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any & ErrorEvent) {
    if (error.message === 'Unknown Message') {
      log.error(
        `Message not found: ${messageId}. ${
          options ? 'Recreating' : 'Not recreating'
        }`
      )
      if (options) {
        message = await channel.send(options)
        return message
      }
    }
  }
  return
}

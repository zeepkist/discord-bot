import { TextChannel } from 'discord.js'

import {
  CreateUpdateStreamOptions,
  DatabaseStream
} from '../../models/twitch.js'
import { addStream } from '../../services/database/twitchStreams.js'
import { log } from '../../utils/index.js'
import { twitchEmbed } from './embed.js'

export const createMessage = async (
  channel: TextChannel,
  knownStreams: DatabaseStream[],
  {
    component,
    stream,
    streamsThisMonth,
    profilePictureUrl
  }: CreateUpdateStreamOptions
) => {
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

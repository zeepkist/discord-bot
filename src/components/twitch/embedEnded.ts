import { formatDistanceToNowStrict } from 'date-fns'
import { EmbedBuilder } from 'discord.js'

import { DatabaseStream } from '../../models/twitch.js'

export const twitchEmbedEnded = (stream: DatabaseStream) => {
  const streamedFor = formatDistanceToNowStrict(stream.createdAt)
  const title = `${stream.userName} has ended their stream!`

  const description = `Streamed for ${streamedFor} with a peak of ${stream.peakViewers} viewers.`

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setURL(`https://twitch.tv/${stream.userName}`)
    .setColor('#6441a5')
    .setTimestamp(stream.createdAt)
    .setThumbnail(
      'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-twitch/contentbuilder/community-meetups_event-thumbnail_400x400.png'
    )

  return embed
}

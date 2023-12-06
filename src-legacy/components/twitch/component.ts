import { HelixStream } from '@twurple/api'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

export const twitchComponent = (stream: HelixStream) =>
  new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Watch on Twitch')
      .setURL(`https://twitch.tv/${stream.userName}`)
  ])

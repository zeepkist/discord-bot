import { EmbedBuilder } from 'discord.js'

export const createEmbed = (title: string): EmbedBuilder =>
  new EmbedBuilder().setTitle(title).setColor(0xff_92_00).setTimestamp()

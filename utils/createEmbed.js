import { EmbedBuilder } from 'discord.js';
export const createEmbed = (title) => new EmbedBuilder().setTitle(title).setColor(0xff_92_00).setTimestamp();

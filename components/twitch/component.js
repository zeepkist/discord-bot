import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
export const twitchComponent = (stream) => new ActionRowBuilder().addComponents([
    new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Watch on Twitch')
        .setURL(`https://twitch.tv/${stream.userName}`)
]);

import { formatDistanceToNowStrict } from 'date-fns';
import { EmbedBuilder } from 'discord.js';
export const twitchEmbed = (stream) => {
    const streamingFor = formatDistanceToNowStrict(new Date(stream.startDate));
    const title = `${stream.userDisplayName} is streaming ${stream.gameName}!`;
    const description = stream.viewers > 0
        ? `Streaming for ${streamingFor} with ${stream.viewers} viewers.\nCome say hi!`
        : `Just started streaming.\nCome say hi!`;
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setURL(`https://twitch.tv/${stream.userName}`)
        .setColor('#6441a5')
        .setTimestamp(stream.startDate)
        .setThumbnail('https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-twitch/contentbuilder/community-meetups_event-thumbnail_400x400.png')
        .setImage(`${stream.getThumbnailUrl(1280, 720)}?${stream.startDate.getTime()}`);
    return embed;
};

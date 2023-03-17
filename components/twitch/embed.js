import { formatDistanceToNowStrict } from 'date-fns';
import { EmbedBuilder } from 'discord.js';
import { formatOrdinal } from '../../utils/index.js';
export const twitchEmbed = async (stream, streamsThisMonth, profilePictureUrl) => {
    const ordinalStreams = formatOrdinal(streamsThisMonth);
    const streamingFor = formatDistanceToNowStrict(new Date(stream.startDate));
    const title = `${stream.userDisplayName} is streaming ${stream.gameName}!`;
    let description = stream.viewers > 0
        ? `Streaming for ${streamingFor} with ${stream.viewers} viewers.`
        : `Just started streaming.`;
    description += `\n\nCome say hi in their ${ordinalStreams} stream this month!!`;
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setURL(`https://twitch.tv/${stream.userName}`)
        .setColor('#6441a5')
        .setTimestamp(stream.startDate)
        .setThumbnail(profilePictureUrl)
        .setImage(`${stream.getThumbnailUrl(1280, 720)}?${stream.startDate.getTime()}=1`);
    return embed;
};

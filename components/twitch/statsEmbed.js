import { EmbedBuilder, hyperlink } from 'discord.js';
import { formatOrdinal } from '../../utils/format.js';
const twitchUserStats = (stats) => `${hyperlink(stats.userName, `https://twitch.tv/${stats.userName}`)} (${Math.floor(stats.value)})`;
export const twitchStatsEmbed = (stats) => {
    const embed = new EmbedBuilder()
        .setTitle('Zeepkist Monthly Twitch Stats')
        .setColor('#6441a5')
        .setThumbnail('https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-twitch/contentbuilder/community-meetups_event-thumbnail_400x400.png')
        .setDescription(`Here's the stats for the past month!`)
        .addFields({
        name: 'Total streams',
        value: String(stats.totalStreams),
        inline: true
    }, {
        name: 'Total streamers',
        value: String(stats.totalStreamers),
        inline: true
    }, {
        name: 'Total viewers',
        value: String(stats.totalViewers),
        inline: true
    }, {
        name: 'Daily peak viewers',
        value: `${stats.mostDailyViewers} (${formatOrdinal(stats.mostDailyViewersDay)})`,
        inline: true
    }, {
        name: 'Average viewers',
        value: String(stats.averageViewers),
        inline: true
    }, {
        name: 'Avg. streams/streamer',
        value: String(stats.averageStreamsStreamer),
        inline: true
    }, {
        name: 'Most streams',
        value: twitchUserStats({
            userName: stats.streamerMostStreamsUserName,
            value: stats.streamerMostStreamsValue
        }),
        inline: true
    }, {
        name: 'Most viewers',
        value: twitchUserStats({
            userName: stats.streamerPeakViewersUserName,
            value: stats.streamerPeakViewersValue
        }),
        inline: true
    }, {
        name: 'Highest average viewers',
        value: twitchUserStats({
            userName: stats.streamerAverageViewersUserName,
            value: stats.streamerAverageViewersValue
        }),
        inline: true
    });
    return embed;
};

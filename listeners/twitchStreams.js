import 'dotenv/config';
import { addHours, addMinutes } from 'date-fns';
import { TextChannel } from 'discord.js';
import { getChannelMessage } from '../components/getChannelMessage.js';
import { twitchComponent } from '../components/twitch/component.js';
import { createMessage } from '../components/twitch/createMessage.js';
import { twitchEmbedEnded } from '../components/twitch/embedEnded.js';
import { sendMonthlyStats } from '../components/twitch/monthlyStats.js';
import { updateMessage } from '../components/twitch/updateMessage.js';
import { getLiveStreams, getMonthlyUserStreams, updateStream } from '../services/database/twitchStreams.js';
import { getStreams, isStreamLive } from '../services/twitch.js';
import { log } from '../utils/index.js';
const GUILD = process.env.DISCORD_ZEEPKIST_GUILD;
const CHANNEL = process.env.DISCORD_ZEEPKIST_CHANNEL;
const knownStreams = await getLiveStreams();
log.info(`Found ${knownStreams.length} live livestreams in the database.`);
async function cleanupOldStreams(channel) {
    try {
        log.info('Cleaning up old streams');
        for (let index = knownStreams.length - 1; index >= 0; index--) {
            const knownStream = knownStreams[index];
            if (await isStreamLive(knownStream.userId))
                continue;
            log.info(`Setting ${knownStream.userName}'s stream to offline`);
            knownStreams.splice(index, 1);
            const streamData = await updateStream(knownStream.messageId, {
                isLive: false
            }, true);
            if (!streamData)
                continue;
            const message = await getChannelMessage(channel, knownStream.messageId);
            if (!message)
                continue;
            const embed = twitchEmbedEnded(streamData);
            message.edit({ embeds: [embed], components: [] });
            log.info(`Set ${knownStream.userName}'s stream to offline`);
        }
    }
    catch (error) {
        log.error(String(error));
    }
}
async function announceStreams(channel) {
    try {
        const streams = await getStreams();
        for (const stream of streams) {
            const streamsThisMonth = await getMonthlyUserStreams(stream.userId);
            const component = twitchComponent(stream);
            const user = await stream.getUser();
            const profilePictureUrl = user?.profilePictureUrl ??
                'https://res.cloudinary.com/startup-grind/image/upload/c_fill,f_auto,g_center,q_auto:good/v1/gcs/platform-data-twitch/contentbuilder/community-meetups_event-thumbnail_400x400.png';
            const knownStream = knownStreams.find(item => item.userId === stream.userId);
            knownStream
                ? updateMessage(channel, knownStream, {
                    component,
                    stream,
                    streamsThisMonth,
                    profilePictureUrl
                })
                : createMessage(channel, knownStreams, {
                    component,
                    stream,
                    streamsThisMonth: streamsThisMonth + 1,
                    profilePictureUrl
                });
        }
    }
    catch (error) {
        log.error(String(error));
    }
}
export const twitchStreams = async (client) => {
    const guild = await client.guilds.fetch(GUILD);
    const channel = await guild.channels.fetch(CHANNEL);
    if (!guild || !channel)
        return;
    if (!(channel instanceof TextChannel))
        return;
    announceStreams(channel);
    sendMonthlyStats(channel);
    setInterval(async () => {
        await announceStreams(channel);
        cleanupOldStreams(channel);
    }, addMinutes(0, 5).getTime());
    setInterval(async () => {
        sendMonthlyStats(channel);
    }, addHours(0, 6).getTime());
};

import 'dotenv/config';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
import { subHours, subMonths } from 'date-fns';
import { TextChannel } from 'discord.js';
import { twitchComponent } from '../components/twitch/component.js';
import { twitchEmbed } from '../components/twitch/embed.js';
import { twitchEmbedEnded } from '../components/twitch/embedEnded.js';
import { database } from '../services/database.js';
const CLIENT_ID = process.env.TWITCH_ID;
const CLIENT_SECRET = process.env.TWITCH_SECRET;
const GUILD = process.env.DISCORD_ZEEPKIST_GUILD;
const CHANNEL = process.env.DISCORD_ZEEPKIST_CHANNEL;
const authProvider = new AppTokenAuthProvider(CLIENT_ID, CLIENT_SECRET);
const apiClient = new ApiClient({ authProvider });
const knownStreams = await database('twitch_streams')
    .where('isLive', true)
    .where('createdAt', '>', subHours(Date.now(), 6));
console.log(knownStreams);
async function getGames() {
    const game = await apiClient.games.getGameByName('Zeepkist');
    if (!game)
        return [];
    const request = game.getStreamsPaginated();
    let page;
    const result = [];
    while ((page = await request.getNext()).length > 0) {
        result.push(...page);
    }
    return result;
}
async function isStreamLive(userName) {
    const user = await apiClient.users.getUserByName(userName);
    if (!user)
        return false;
    const stream = await apiClient.streams.getStreamByUserId(user.id);
    return !!stream;
}
async function cleanupOldStreams(channel) {
    for await (const knownStream of knownStreams) {
        const seconds = (Date.now() - knownStream.createdAt.getTime()) / 1000;
        if ((!(await isStreamLive(knownStream.userName)) && seconds > 60 * 60) ||
            seconds > 60 * 60 * 12) {
            console.log('Trying to remove stream from ' + knownStream.userName);
            for (let index = knownStreams.length - 1; index >= 0; index--) {
                if (knownStreams[index].userId == knownStream.userId) {
                    knownStreams.splice(index, 1);
                    await database('twitch_streams')
                        .where('messageId', knownStream.messageId)
                        .update('isLive', false);
                    const message = await channel.messages.fetch(knownStream.messageId);
                    if (message == undefined) {
                        console.log('Message not found: ' + knownStream.messageId);
                    }
                    else {
                        const embed = twitchEmbedEnded(knownStream);
                        message.edit({ embeds: [embed], components: [] });
                    }
                    console.log('Removed stream from ' + knownStream.userName);
                }
            }
        }
    }
}
const getMonthlyStreams = async (userId) => {
    const response = await database('twitch_streams')
        .where('userId', userId)
        .where('createdAt', '>', subMonths(Date.now(), 1))
        .count({ count: 'userId' })
        .first();
    return Number(response?.count ?? 0);
};
async function announceStreams(channel) {
    const games = await getGames();
    for (const stream of games) {
        const streamsThisMonth = await getMonthlyStreams(stream.userId);
        const component = twitchComponent(stream);
        if (knownStreams.some(item => item.userName === stream.userName)) {
            const data = knownStreams.find(item => item.userName === stream.userName);
            if (data === undefined)
                return;
            if (data.messageId != undefined && data.viewers != stream.viewers) {
                const embed = twitchEmbed(stream, streamsThisMonth);
                const message = await channel.messages.fetch(data.messageId);
                if (message == undefined) {
                    console.log('Message not found: ' + data.messageId);
                }
                else {
                    message.edit({ embeds: [embed], components: [component] });
                }
            }
        }
        else {
            console.log(stream.userDisplayName +
                ' is playing ' +
                stream.gameName +
                ' with ' +
                stream.viewers +
                ' viewers on https://twitch.tv/' +
                stream.userName);
            const embed = twitchEmbed(stream, streamsThisMonth + 1);
            const message = await channel.send({
                embeds: [embed],
                components: [component]
            });
            const streamData = {
                isLive: true,
                streamId: stream.id,
                messageId: message.id,
                createdAt: stream.startDate,
                updatedAt: new Date(Date.now()),
                userId: stream.userId,
                userName: stream.userName,
                viewers: stream.viewers
            };
            await database('twitch_streams').insert(streamData);
            knownStreams.push(streamData);
            console.log('Added ' + stream.userName + ' to known streams');
        }
    }
}
export const twitchStreams = async (client) => {
    const guild = await client.guilds.fetch(GUILD);
    const channel = await guild.channels.fetch(CHANNEL);
    if (!guild || !channel)
        return;
    if (!(channel instanceof TextChannel))
        return;
    await announceStreams(channel);
    setInterval(async () => {
        await announceStreams(channel);
        cleanupOldStreams(channel);
    }, 1000 * 60 * 5);
};

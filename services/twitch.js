import 'dotenv/config';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
import { TextChannel } from 'discord.js';
import { twitchComponent } from '../components/twitch/component.js';
import { twitchEmbed } from '../components/twitch/embed.js';
const CLIENT_ID = process.env.TWITCH_ID;
const CLIENT_SECRET = process.env.TWITCH_SECRET;
const GUILD = process.env.DISCORD_ZEEPKIST_GUILD;
const CHANNEL = process.env.DISCORD_ZEEPKIST_CHANNEL;
const authProvider = new AppTokenAuthProvider(CLIENT_ID, CLIENT_SECRET);
const apiClient = new ApiClient({ authProvider });
const knownStreams = [];
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
async function cleanupOldStreams() {
    for await (const stream of knownStreams) {
        const seconds = (Date.now() - stream.time.getTime()) / 1000;
        if ((!(await isStreamLive(stream.userName)) && seconds > 60 * 60) ||
            seconds > 60 * 60 * 12) {
            console.log('Trying to remove stream from ' + stream.userName);
            for (let index = knownStreams.length - 1; index >= 0; index--) {
                if (knownStreams[index].id == stream.id) {
                    knownStreams.splice(index, 1);
                    console.log('Removed stream from ' + stream.userName);
                }
            }
        }
    }
}
async function announceStreams(client, firstTime = false) {
    const guild = await client.guilds.fetch(GUILD);
    const channel = await guild.channels.fetch(CHANNEL);
    if (!guild || !channel)
        return;
    if (!(channel instanceof TextChannel))
        return;
    const games = await getGames();
    for (const stream of games) {
        if (knownStreams.some(item => item.userName === stream.userName)) {
            const data = knownStreams.find(item => item.userName === stream.userName);
            if (data === undefined)
                return;
            if (data.message != undefined && data.viewers != stream.viewers) {
                const embed = twitchEmbed(stream);
                const component = twitchComponent(stream);
                const message = await channel.messages.fetch(data.message.id);
                if (message == undefined) {
                    console.log('Message not found: ' + data.message);
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
            const streamdata = {
                id: stream.id,
                time: new Date(),
                userId: stream.userId,
                userName: stream.userName,
                viewers: stream.viewers
            };
            if (!firstTime) {
                const embed = twitchEmbed(stream);
                const component = twitchComponent(stream);
                streamdata.viewers = stream.viewers;
                streamdata.message = await channel.send({
                    embeds: [embed],
                    components: [component]
                });
            }
            knownStreams.push(streamdata);
        }
    }
}
export const twitch = async (client) => {
    await announceStreams(client, true);
    setInterval(async () => {
        await announceStreams(client);
        cleanupOldStreams();
    }, 1000 * 60 * 5);
};
60 * 5;

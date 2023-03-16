import 'dotenv/config';
import { ApiClient } from '@twurple/api';
import { AppTokenAuthProvider } from '@twurple/auth';
const CLIENT_ID = process.env.TWITCH_ID;
const CLIENT_SECRET = process.env.TWITCH_SECRET;
const authProvider = new AppTokenAuthProvider(CLIENT_ID, CLIENT_SECRET);
const apiClient = new ApiClient({ authProvider });
export const getStreams = async () => {
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
};
export const getStream = async (userId) => {
    return await apiClient.streams.getStreamByUserId(userId);
};
export const isStreamLive = async (userId) => {
    const stream = await getStream(userId);
    return !!stream;
};

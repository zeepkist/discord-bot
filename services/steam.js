import axios from 'axios';
import { STEAM_API_URL } from '../constants.js';
const key = process.env.STEAM_KEY;
const api = axios.create({
    baseURL: STEAM_API_URL
});
export const getPlayerSummaries = async (steamIds) => {
    const response = await api.get('ISteamUser/GetPlayerSummaries/v0002/', {
        params: {
            key,
            steamids: steamIds.join(',')
        }
    });
    if (response.status === 200)
        return response.data;
    else {
        throw response.data.error;
    }
};

import { api } from './api.js';
export const getUser = async ({ Id, SteamId }) => {
    const response = await (Id
        ? api.get('users/id', { params: { Id } })
        : api.get('users/steamid', { params: { SteamId } }));
    if (response.status === 200)
        return response.data;
    else {
        throw response.data.error;
    }
};
export const getUserRanking = async (query = {}) => {
    const response = await api.get('users/ranking', { params: query });
    if (response.status === 200)
        return response.data;
    else {
        throw response.data.error;
    }
};
export const getUserRankings = async (query = {}) => {
    const response = await api.get('users/rankings', { params: query });
    if (response.status === 200)
        return response.data;
    else {
        throw response.data.error;
    }
};

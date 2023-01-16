import { api } from './api.js';
export const getUser = async ({ id, steamId }) => {
    try {
        const response = await (id
            ? api.get('user/id', { params: { id } })
            : api.get('user/steamid', { params: { SteamId: steamId } }));
        if (response.status === 200)
            return response.data;
        else {
            throw response.data.error;
        }
    }
    catch (error) {
        throw error;
    }
};

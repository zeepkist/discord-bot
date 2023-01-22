import { api } from './api.js';
export const getLevels = async (query = {}) => {
    const response = await api.get('levels', { params: query });
    if (response.status === 200)
        return response.data;
    else {
        throw response.data.error;
    }
};
export const searchLevels = async (query) => {
    const response = await api.get('levels/search', { params: query });
    if (response.status === 200)
        return response.data;
    else {
        throw response.data.error;
    }
};

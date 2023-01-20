import { api } from './api.js';
export const getRecords = async (query = {}) => {
    const response = await api.get('record', { params: query });
    if (response.status === 200)
        return response.data;
    else {
        throw response.data.error;
    }
};
export const getRecentRecords = async () => {
    const response = await api.get('records/recent');
    if (response.status === 200)
        return response.data;
    else {
        throw response.data.error;
    }
};

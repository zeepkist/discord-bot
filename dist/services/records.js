import { api } from './api.js';
export const getRecords = async ({ LevelId, LevelUid, LevelWorkshopId, UserSteamId, UserId, BestOnly, ValidOnly, WorldRecordOnly, Limit, Offset } = {}) => {
    try {
        const query = {
            LevelId,
            LevelUid,
            LevelWorkshopId,
            UserSteamId,
            UserId,
            BestOnly,
            ValidOnly,
            WorldRecordOnly,
            Limit,
            Offset
        };
        const response = await api.get('record', { params: query });
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
export const getRecentRecords = async ({ LevelId, LevelUid, LevelWorkshopId, UserSteamId, UserId, BestOnly, ValidOnly, WorldRecordOnly, Limit, Offset } = {}) => {
    try {
        const query = {
            LevelId,
            LevelUid,
            LevelWorkshopId,
            UserSteamId,
            UserId,
            BestOnly,
            ValidOnly,
            WorldRecordOnly,
            Limit,
            Offset
        };
        const response = await api.get('record/recent', { params: query });
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

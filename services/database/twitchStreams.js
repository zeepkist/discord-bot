import { isFirstDayOfMonth, startOfMonth } from 'date-fns';
import { log } from '../../utils/index.js';
import { database } from '../database.js';
export const getLiveStreams = async () => (await database('twitch_streams').where('isLive', true));
export const addStream = async (stream) => await database('twitch_streams').insert(stream);
export const updateStream = async (messageId, stream, shouldReturnData = false) => {
    const result = await database('twitch_streams')
        .where('messageId', messageId)
        .update({
        ...stream,
        updatedAt: new Date(Date.now())
    });
    if (shouldReturnData && result > 0) {
        return (await database('twitch_streams')
            .where('messageId', messageId)
            .select('*')
            .first());
    }
};
export const getMonthlyUserStreams = async (userId) => {
    const firstDayOfMonth = startOfMonth(Date.now());
    const result = await database('twitch_streams')
        .where('userId', userId)
        .andWhere('createdAt', '>', firstDayOfMonth)
        .count({ count: 'userId' })
        .first();
    return Number(result?.count ?? 0);
};
export const getMonthlyStats = async () => {
    const now = Date.now();
    const firstDayOfMonth = startOfMonth(now);
    if (!isFirstDayOfMonth(now))
        return;
    const result = await database('twitch_stats')
        .where('createdAt', '>=', firstDayOfMonth)
        .first();
    if (result)
        return;
    log.info('Creating monthly stats');
    const stats = await database('twitch_streams')
        .select(database.raw('COUNT(DISTINCT streamId) as totalStreams'), database.raw('COUNT(DISTINCT userId) as totalStreamers'), database.raw('AVG(viewers) as averageViewers'), database.raw('SUM(viewers) as totalViewers'))
        .where('createdAt', '>=', firstDayOfMonth)
        .first();
    const mostDailyViewers = await database('twitch_streams')
        .select(database.raw('DAY(createdAt) as day'), database.raw('SUM(viewers) as totalViewers'))
        .where('createdAt', '>=', firstDayOfMonth)
        .groupBy('day')
        .orderBy('totalViewers', 'desc')
        .first();
    const mostStreams = await database('twitch_streams')
        .select('userName', database.raw('COUNT(DISTINCT streamId) as value'))
        .where('createdAt', '>=', firstDayOfMonth)
        .groupBy('userId')
        .orderBy('value', 'desc')
        .first();
    const peakViewers = await database('twitch_streams')
        .select('userName', database.raw('MAX(peakViewers) as value'))
        .where('createdAt', '>=', firstDayOfMonth)
        .groupBy('userId')
        .orderBy('value', 'desc')
        .first();
    const averageViewers = await database('twitch_streams')
        .select('userName', database.raw('AVG(viewers) as value'))
        .where('createdAt', '>=', firstDayOfMonth)
        .groupBy('userId')
        .orderBy('value', 'desc')
        .first();
    log.info('Gathered stats');
    const data = {
        totalStreams: stats.totalStreams,
        totalStreamers: stats.totalStreamers,
        totalViewers: stats.totalViewers,
        mostDailyViewers: mostDailyViewers.totalViewers,
        mostDailyViewersDay: mostDailyViewers.day,
        averageViewers: Math.floor(stats.averageViewers),
        averageStreamsStreamer: Math.floor(stats.totalStreams / stats.totalStreamers),
        streamerMostStreamsUserName: mostStreams.userName,
        streamerMostStreamsValue: mostStreams.value,
        streamerPeakViewersUserName: peakViewers.userName,
        streamerPeakViewersValue: peakViewers.value,
        streamerAverageViewersUserName: averageViewers.userName,
        streamerAverageViewersValue: Math.floor(averageViewers.value)
    };
    log.info('Saving stats');
    database('twitch_stats').insert(data);
    return data;
};

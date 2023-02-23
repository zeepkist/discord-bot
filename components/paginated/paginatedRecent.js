import { getRecords } from '@zeepkist/gtr-api';
import { EmbedBuilder } from 'discord.js';
import { PAGINATION_LIMIT } from '../../constants.js';
import { listRecords } from '../lists/listRecords.js';
import { getPaginatedData, sendPaginatedMessage } from '../paginated.js';
export const paginatedRecent = async (properties) => {
    const { interaction } = properties;
    const data = await getPaginatedData(properties);
    const { records, totalAmount } = await getRecords({
        Limit: PAGINATION_LIMIT,
        Offset: data.offset,
        BestOnly: true,
        WorldRecordOnly: data.query?.worldRecordsOnly,
        Sort: '-id'
    });
    const recordsList = listRecords({
        records: records,
        offset: data.offset,
        showRank: true,
        showUser: true,
        showLevel: true,
        showMedal: true
    });
    const embed = new EmbedBuilder()
        .setTitle(`Recent ${data.query?.worldRecordsOnly ? 'World Records' : 'Personal Bests'}`)
        .setDescription(recordsList ?? 'No recent records.');
    await sendPaginatedMessage({
        customId: 'recent',
        interaction,
        embed,
        query: data.query,
        currentPage: data.currentPage,
        totalAmount
    });
};

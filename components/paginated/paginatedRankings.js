import { EmbedBuilder } from 'discord.js';
import { PAGINATION_LIMIT } from '../../constants.js';
import { getUserRankings } from '../../services/users.js';
import { listRankings } from '../lists/listRankings.js';
import { getPaginatedData, sendPaginatedMessage } from '../paginated.js';
export const paginatedRankings = async (properties) => {
    const { interaction } = properties;
    const data = await getPaginatedData(properties);
    const { rankings, totalAmount } = await getUserRankings({
        Limit: PAGINATION_LIMIT,
        Offset: data.offset
    });
    const rankingsList = listRankings({
        rankings,
        offset: data.offset
    });
    const embed = new EmbedBuilder()
        .setColor(0xff_92_00)
        .setTitle(`Players with the most world records`)
        .setDescription(rankingsList ?? 'No users.');
    await sendPaginatedMessage({
        customId: 'rankings',
        interaction,
        embed,
        query: data.query,
        currentPage: data.currentPage,
        totalAmount
    });
};

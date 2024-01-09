import { PAGINATION_LIMIT } from '../config/index.js';
import { getRecords } from '../services/getRecords.js';
import { bestMedal, createEmbed, formatDiscordDate, formatLevel, formatResultTime, formatUser } from '../utils/index.js';
import { getPaginatedData, sendPaginatedMessage } from './paginated.js';
export const createRecords = async (properties) => {
    const { interaction } = properties;
    const data = await getPaginatedData(properties);
    const records = await getRecords(data.offset, data.query.recordType, data.query.user);
    const totalPages = Math.ceil((records?.totalCount ?? PAGINATION_LIMIT) / PAGINATION_LIMIT);
    const titleUser = data.query.user
        ? ` by ${data.query.user.displayName ?? data.query.user.tag}`
        : '';
    const titleRecordType = data.query.recordType === "wr"
        ? 'World Records'
        : data.query.recordType === "pb"
            ? 'Personal Bests'
            : 'Records';
    const embed = createEmbed(`Recent ${titleRecordType}${titleUser}`);
    const description = records?.nodes.map(record => {
        if (!record || !record.userByUser)
            return;
        const { userByUser: user, dateCreated, time, level, isWorldRecord } = record;
        return `${bestMedal(time, level, isWorldRecord)} ${formatResultTime(time)} ${formatUser(user)} - ${formatLevel(level)} (${formatDiscordDate(dateCreated)})`;
    });
    embed.setFooter({
        text: `Page ${data.currentPage} of ${totalPages}`
    });
    embed.setDescription(description?.join('\n') ?? 'No records found');
    console.debug(data);
    await sendPaginatedMessage({
        customId: "records",
        interaction,
        embed,
        query: data.query,
        currentPage: data.currentPage,
        totalAmount: records?.totalCount ?? PAGINATION_LIMIT
    });
};

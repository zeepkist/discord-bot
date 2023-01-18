import { bold, EmbedBuilder, hyperlink, inlineCode, italic } from 'discord.js';
import { getRecentRecords } from '../services/records.js';
import { formatRelativeDate, formatResultTime, providedBy } from '../utils/index.js';
import { paginationButtons } from './paginationButtons.js';
export const recentRecords = async (interaction, page = 1, limit = 10) => {
    const records = await getRecentRecords();
    const filteredRecords = records.records.filter(record => record.isBest || record.isWorldRecord);
    const totalPages = Math.ceil(filteredRecords.length / limit);
    const offset = (page - 1) * limit;
    const cutoff = page * limit;
    console.log(`[recent]: Obtained ${filteredRecords.length} recent records. ${page}/${totalPages} pages.`);
    const recordsList = filteredRecords
        .slice(offset, cutoff)
        .map((record, index) => {
        const recordNumber = bold(`${index + 1 + offset}.`);
        const recordTime = inlineCode(formatResultTime(record.time));
        const recordUser = hyperlink(record.user.steamName, `https://zeepkist.wopian.me/user/${record.user.steamId}`);
        const recordLevel = `${italic(hyperlink(record.level.name, `https://zeepkist.wopian.me/level/${record.level.id}`))} by ${record.level.author}`;
        const recordWR = record.isWorldRecord ? ' (WR)' : '';
        const recordDate = formatRelativeDate(record.dateCreated);
        return `${recordNumber} ${recordUser} got ${recordTime}${recordWR} on ${recordLevel} (${recordDate})`;
    })
        .join('\n');
    const embed = new EmbedBuilder()
        .setColor(0xff_92_00)
        .setTitle(`Recent Personal Bests`)
        .setDescription(recordsList ?? 'No recent records.')
        .setFooter({
        text: `Page ${page} of ${totalPages}. ${providedBy}`
    })
        .setTimestamp();
    const pagination = paginationButtons(interaction, 'recent', page, totalPages);
    return {
        embeds: [embed],
        components: pagination ? [pagination] : []
    };
};

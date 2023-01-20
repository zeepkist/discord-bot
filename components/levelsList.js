import { bold, EmbedBuilder, italic } from 'discord.js';
import { providedBy } from '../utils/providedBy.js';
import { listLevels } from './lists/listRecords.js';
export const levelsList = async (interaction, levels, totalAmount) => {
    const list = listLevels({ levels, showRank: true, showId: true });
    let description = `Found ${bold(String(totalAmount))} levels:\n\n${list}`;
    if (totalAmount > 10) {
        description += `\n\n${italic('Only the first 10 levels are shown.')}`;
    }
    const embed = new EmbedBuilder()
        .setColor(0xff_92_00)
        .setTitle('Level Search Results')
        .setDescription(description)
        .setFooter({ text: providedBy });
    return { embeds: [embed] };
};

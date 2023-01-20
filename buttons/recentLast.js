import { recentRecords } from '../components/recentRecords.js';
import { extractPages } from '../utils/index.js';
export const recentLast = {
    name: 'recentLastButton',
    run: async (interaction) => {
        const { totalPages } = extractPages(interaction.message.embeds[0].footer?.text);
        const { embeds, components } = await recentRecords(interaction, totalPages);
        interaction.update({ embeds, components });
    }
};

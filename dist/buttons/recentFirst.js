import { recentRecords } from '../components/recentRecords.js';
export const recentFirst = {
    name: 'recentFirstButton',
    run: async (interaction) => {
        const { embeds, components } = await recentRecords(interaction);
        interaction.update({ embeds, components });
    }
};

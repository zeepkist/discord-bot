import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
export const paginatedButtons = (interaction, customId, page, maxPages) => {
    if (maxPages === 1)
        return;
    const prefix = 'paginationButton-';
    const buttons = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
            .setCustomId(`${prefix}${"first"}-${customId}`)
            .setLabel('First')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 1),
        new ButtonBuilder()
            .setCustomId(`${prefix}${"previous"}-${customId}`)
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 1),
        new ButtonBuilder()
            .setCustomId(`${prefix}${"next"}-${customId}`)
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === maxPages),
        new ButtonBuilder()
            .setCustomId(`${prefix}${"last"}-${customId}`)
            .setLabel('Last')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === maxPages)
    ]);
    const collector = interaction.channel?.createMessageComponentCollector({
        filter: (m) => [
            "first",
            "previous",
            "next",
            "last"
        ].includes(m.customId.split(prefix)[1].split('-')[0]),
        time: 3 * 1000 * 60
    });
    collector?.on('end', () => {
        buttons.components[0].setDisabled(true);
        buttons.components[1].setDisabled(true);
        buttons.components[2].setDisabled(true);
        buttons.components[3].setDisabled(true);
        interaction.editReply({ components: [buttons] });
    });
    return buttons;
};

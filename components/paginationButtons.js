import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
export const paginationButtons = (interaction, customIdPrefix, page, maxPages) => {
    if (maxPages === 1)
        return;
    const buttons = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
            .setCustomId(`${customIdPrefix}FirstButton`)
            .setLabel('First')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 1),
        new ButtonBuilder()
            .setCustomId(`${customIdPrefix}PreviousButton`)
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 1),
        new ButtonBuilder()
            .setCustomId(`${customIdPrefix}NextButton`)
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === maxPages),
        new ButtonBuilder()
            .setCustomId(`${customIdPrefix}LastButton`)
            .setLabel('Last')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === maxPages)
    ]);
    const collector = interaction.channel?.createMessageComponentCollector({
        filter: (m) => ['first', 'previous', 'next', 'last'].includes(m.customId),
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

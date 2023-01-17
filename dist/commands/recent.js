import { ActionRowBuilder, ApplicationCommandType, bold, ButtonBuilder, ButtonStyle, EmbedBuilder, hyperlink, inlineCode, italic } from 'discord.js';
import { getRecentRecords } from '../services/records.js';
import { formatRelativeDate } from '../utils/formatRelativeDate.js';
import { formatResultTime } from '../utils/formatResultTime.js';
export const recent = {
    name: 'recent',
    description: 'Get recent personal bests and world records',
    type: ApplicationCommandType.ChatInput,
    options: [],
    run: async (interaction) => {
        try {
            const recentRecords = await getRecentRecords();
            const bestAndWrRecords = recentRecords.records.filter(record => {
                return record.isBest || record.isWorldRecord;
            });
            console.log('[recent]:', 'obtained recent records', bestAndWrRecords.length);
            const recentRecordsList = bestAndWrRecords
                .slice(0, 10)
                .map((record, index) => {
                const recordNumber = bold(`${index + 1}.`);
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
                .setDescription(recentRecordsList)
                .setFooter({
                text: `Page 1 of ${Math.ceil(bestAndWrRecords.length / 10)}. Data provided by Zeepkist GTR`
            })
                .setTimestamp();
            const paginationButtons = new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                    .setCustomId('recentFirstButton')
                    .setLabel('First')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('recentPreviousButton')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('recentNextButton')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('recentLastButton')
                    .setLabel('Last')
                    .setStyle(ButtonStyle.Primary)
            ]);
            if (bestAndWrRecords.length > 10) {
                const collector = interaction.channel?.createMessageComponentCollector({
                    filter: (m) => ['first', 'previous', 'next', 'last'].includes(m.customId),
                    time: 5 * 1000 * 60
                });
                collector?.on('end', () => {
                    paginationButtons.components[0].setDisabled(true);
                    paginationButtons.components[1].setDisabled(true);
                    paginationButtons.components[2].setDisabled(true);
                    paginationButtons.components[3].setDisabled(true);
                    interaction.editReply({ components: [paginationButtons] });
                });
            }
            interaction.reply({
                embeds: [embed],
                components: bestAndWrRecords.length > 10 ? [paginationButtons] : []
            });
        }
        catch (error) {
            console.error(String(error));
            await interaction.reply({
                ephemeral: true,
                content: 'An error occurred while fetching user data. Please try again later.'
            });
        }
    }
};

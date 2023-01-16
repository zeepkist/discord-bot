import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, bold, ButtonBuilder, ButtonStyle, EmbedBuilder, hyperlink, inlineCode, italic } from 'discord.js';
import { getLevels } from '../services/levels.js';
import { getRecords } from '../services/records.js';
import { formatRelativeDate } from '../utils/formatRelativeDate.js';
import { formatResultTime } from '../utils/formatResultTime.js';
export const level = {
    name: 'level',
    description: 'Get records for a level',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'id',
            description: 'The id of the level',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'workshopid',
            description: 'The workshop id of the level(s)',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'author',
            description: 'The author of the level(s)',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'name',
            description: 'The name of the level(s)',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    run: async (interaction) => {
        const id = interaction.options.data.find(option => option.name === 'id')
            ?.value;
        const workshopId = interaction.options.data.find(option => option.name === 'workshopid')?.value;
        const author = interaction.options.data.find(option => option.name === 'author')?.value;
        const name = interaction.options.data.find(option => option.name === 'name')
            ?.value;
        console.log('[level]:', id, workshopId, author, name);
        if (!id && !workshopId && !author && !name) {
            console.log('[level]:', 'No arguments provided');
            await interaction.reply({
                content: 'You must provide either a level ID, workshop ID, author or name of a level.',
                ephemeral: true
            });
            return;
        }
        try {
            const levels = await getLevels({
                Id: id,
                WorkshopId: workshopId,
                Author: author,
                Name: name
            });
            if (levels.totalAmount === 0) {
                console.log('[level]:', 'No level found', levels);
                const embed = new EmbedBuilder()
                    .setColor(0xff_00_00)
                    .setTitle('No level found')
                    .setDescription('No level found with the provided arguments.')
                    .setTimestamp();
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
            if (levels.totalAmount > 1) {
                console.log('[level]:', 'Found multiple levels', levels);
                const levelsList = levels.levels
                    .slice(0, 10)
                    .map((level, index) => {
                    const levelNumber = bold(`${index + 1}.`);
                    const levelName = hyperlink(level.name, `https://zeepkist.wopian.me/level/${level.id}`);
                    const levelAuthor = italic(level.author);
                    const levelId = inlineCode(String(level.id));
                    return `${levelNumber} ${levelName} by ${levelAuthor} (ID ${levelId})`;
                })
                    .join('\n');
                const embed = new EmbedBuilder()
                    .setColor(0xff_92_00)
                    .setTitle('Levels')
                    .setDescription(`Found ${bold(String(levels.totalAmount))} levels matching your search:\n\n${levelsList}`)
                    .setFooter({
                    text: `Data provided by Zeepkist GTR`
                });
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
            if (levels.totalAmount === 1) {
                console.log('[level]:', 'Found 1 level', levels);
                const level = levels.levels[0];
                const records = await getRecords({
                    LevelId: level.id,
                    BestOnly: true,
                    Limit: 10
                });
                const recordsList = records.records
                    .slice(0, 10)
                    .map((record, index) => {
                    const recordNumber = bold(`${index + 1}.`);
                    const recordTime = inlineCode(formatResultTime(record.time));
                    const recordUser = hyperlink(record.user.steamName, `https://zeepkist.wopian.me/user/${record.user.steamId}`);
                    const recordLevel = `${italic(hyperlink(record.level.name, `https://zeepkist.wopian.me/level/${record.level.id}`))} by ${record.level.author}`;
                    const recordDate = formatRelativeDate(record.dateCreated);
                    return `${recordNumber} ${recordUser} got ${recordTime} on ${recordLevel} (${recordDate})`;
                })
                    .join('\n');
                const embed = new EmbedBuilder()
                    .setColor(0xff_92_00)
                    .setTitle(level.name)
                    .setURL(`http://zeepkist.wopian.me/level/${level.id}`)
                    .setTimestamp()
                    .setFooter({
                    text: `Page 1 of ${Math.ceil(records.records.length / 10)}. Data provided by Zeepkist GTR`
                })
                    .setDescription(`${records.totalAmount} records\n\n${recordsList}`);
                if (level.thumbnailUrl)
                    embed.setThumbnail(level.thumbnailUrl);
                const paginationButtons = new ActionRowBuilder().addComponents([
                    new ButtonBuilder()
                        .setCustomId('first')
                        .setLabel('First')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('last')
                        .setLabel('Last')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                ]);
                await interaction.reply({
                    embeds: [embed],
                    components: [paginationButtons]
                });
            }
        }
        catch (error) {
            console.error(error, String(error));
            await interaction.reply({
                ephemeral: true,
                content: 'An error occurred while fetching user data. Please try again later.'
            });
        }
    }
};

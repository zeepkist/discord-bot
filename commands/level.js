import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from 'discord.js';
import { errorReply } from '../components/errorReply.js';
import { paginatedLevel } from '../components/paginated/paginatedLevel.js';
import { paginatedLevels } from '../components/paginated/paginatedLevels.js';
import { getLevels } from '../services/levels.js';
import { log } from '../utils/log.js';
const getOptions = (interaction) => {
    const id = interaction.options.data.find(option => option.name === 'id')
        ?.value;
    const workshopId = interaction.options.data.find(option => option.name === 'workshopid')?.value;
    const author = interaction.options.data.find(option => option.name === 'author')?.value;
    const name = interaction.options.data.find(option => option.name === 'name')
        ?.value;
    return { id, workshopId, author, name };
};
const replyNoLevels = async (interaction, invalidArguments = false) => {
    const embed = new EmbedBuilder()
        .setColor(0xff_00_00)
        .setTitle(invalidArguments ? 'Missing Arguments' : 'No level found')
        .setDescription(invalidArguments
        ? 'You must provide either a level ID, workshop ID, author or name of a level.'
        : 'No level found with the provided arguments.')
        .setTimestamp();
    await interaction.reply({ embeds: [embed], ephemeral: true });
};
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
        const { id, workshopId, author, name } = getOptions(interaction);
        log.info(interaction, `${id} ${workshopId} ${author} ${name}`);
        if (!id && !workshopId && !author && !name) {
            log.info(interaction, 'No arguments provided');
            await replyNoLevels(interaction, true);
            return;
        }
        try {
            const levels = await getLevels({
                Id: id,
                WorkshopId: workshopId,
                Author: author,
                Name: name,
                Limit: 1
            });
            if (levels.totalAmount === 0) {
                log.info(interaction, 'No levels found');
                await replyNoLevels(interaction);
                return;
            }
            log.info(interaction, `Found ${levels.totalAmount} levels`);
            if (levels.totalAmount > 1) {
                await paginatedLevels({
                    interaction,
                    action: 'first',
                    query: { id, workshopId, author, name }
                });
                return;
            }
            if (levels.totalAmount === 1) {
                await paginatedLevel({
                    interaction,
                    action: 'first',
                    query: { id: levels.levels[0].id }
                });
            }
        }
        catch (error) {
            errorReply(interaction, level.name, error);
        }
    }
};

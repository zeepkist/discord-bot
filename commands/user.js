import { getUser, getUserBySteamId } from '@zeepkist/gtr-api';
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, inlineCode } from 'discord.js';
import { userEmbed } from '../components/embeds/userEmbed.js';
import { userNotFoundEmbed } from '../components/embeds/userNotFoundEmbed.js';
import { database } from '../services/database.js';
import { log } from '../utils/index.js';
export const user = {
    name: 'user',
    description: 'Get information about a user.',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'steamid',
            description: "User's Steam ID.",
            type: ApplicationCommandOptionType.String,
            required: false,
            minLength: 17,
            maxLength: 17
        },
        {
            name: 'id',
            description: "User's internal ID.",
            type: ApplicationCommandOptionType.String,
            required: false,
            minLength: 0
        }
    ],
    ephemeral: false,
    run: async (interaction) => {
        const linkedAccount = await database('linked_accounts')
            .select('steamId')
            .where({
            discordId: interaction.user.id
        });
        log.info(`Found ${linkedAccount.length} linked accounts.`, interaction);
        let steamId = interaction.options.data.find(option => option.name === 'steamid')?.value;
        const id = interaction.options.data.find(option => option.name === 'id')
            ?.value;
        log.info(`Steam ID: ${steamId}, ID: ${id}`, interaction);
        if ((!linkedAccount || linkedAccount.length === 0) && !steamId && !id) {
            log.info('No linked account or option arguments provided. Ending interaction.', interaction);
            const embed = new EmbedBuilder()
                .setColor(0xff_92_00)
                .setTitle('User not linked')
                .setDescription(`You must provide either a Steam ID or a user ID.\n\nIf you link your Steam account with ${inlineCode('/verify')}, you can use this command without providing a Steam ID or user ID.`)
                .setTimestamp();
            await interaction.editReply({
                embeds: [embed]
            });
            return;
        }
        if (!steamId && !id) {
            steamId = linkedAccount[0].steamId;
            log.info(`Using linked account Steam ID: ${steamId}`, interaction);
        }
        try {
            const user = steamId ? await getUserBySteamId(steamId) : await getUser(id);
            log.info(`Found user: ${user.steamName}`, interaction);
            await userEmbed(interaction, user);
        }
        catch (error) {
            log.error(String(error), interaction);
            userNotFoundEmbed(interaction);
        }
    }
};

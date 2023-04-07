import { getLevels, getRecords, getUser, getUserRanking } from '@zeepkist/gtr-api';
import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder, inlineCode } from 'discord.js';
import { HTTPError } from 'ky-universal';
import { listRecords } from '../components/lists/listRecords.js';
import { STEAM_URL, ZEEPKIST_URL } from '../constants.js';
import { database } from '../services/database.js';
import { getPlayerSummaries } from '../services/steam.js';
import { formatFlagEmoji, formatOrdinal, log, userSimilarity } from '../utils/index.js';
const addDiscordAuthor = (interaction, embed, linkedAccount, steamId) => {
    log.info(`Adding Discord author: ${linkedAccount.tag}`, interaction);
    embed.setAuthor({
        name: linkedAccount.username,
        iconURL: linkedAccount.avatarURL() ?? '',
        url: `${ZEEPKIST_URL}/user/${steamId}`
    });
    if (linkedAccount.hexAccentColor) {
        embed.setColor(linkedAccount.hexAccentColor);
    }
};
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
            const user = await getUser({ SteamId: steamId, Id: id });
            log.info(`Found user: ${user.steamName}`, interaction);
            const steamPlayerSummary = await getPlayerSummaries([user.steamId]);
            const steamUser = steamPlayerSummary.response.players[0];
            log.info(`Found Steam player summary. Private: ${steamUser.communityvisibilitystate === 1}`, interaction);
            const levelsCreated = await getLevels({
                Author: user.steamName,
                Limit: 0
            });
            log.info(`Found ${levelsCreated.totalAmount} levels created by ${user.steamName}.`, interaction);
            let userRanking;
            try {
                userRanking = await getUserRanking({ SteamId: user.steamId });
                log.info(`Found user ranking: ${userRanking.position}`, interaction);
            }
            catch (error) {
                if (error instanceof HTTPError && error.response.status === 404) {
                    userRanking = {
                        position: 0,
                        totalAmount: 0
                    };
                }
                else {
                    throw error;
                }
            }
            const userRankingPosition = userRanking.position
                ? `(${formatOrdinal(userRanking.position)})`
                : '';
            const allValidRecords = await getRecords({
                UserSteamId: steamId,
                UserId: id,
                ValidOnly: true,
                Limit: 0
            });
            log.info(`Found ${allValidRecords.totalAmount} valid records.`, interaction);
            const allInvalidRecords = await getRecords({
                UserSteamId: steamId,
                UserId: id,
                InvalidOnly: true,
                Sort: '-id',
                Limit: 5
            });
            log.info(`Found ${allInvalidRecords.totalAmount} invalid records.`, interaction);
            const bestRecords = await getRecords({
                UserSteamId: steamId,
                UserId: id,
                BestOnly: true,
                Sort: '-id',
                Limit: 5
            });
            log.info(`Found ${bestRecords.totalAmount} best records.`, interaction);
            const worldRecords = await getRecords({
                UserSteamId: steamId,
                UserId: id,
                WorldRecordOnly: true,
                Sort: '-id',
                Limit: 5
            });
            log.info(`Found ${worldRecords.totalAmount} world records.`, interaction);
            const totalRuns = allValidRecords.totalAmount + allInvalidRecords.totalAmount;
            log.info(`Found ${totalRuns} total runs.`, interaction);
            const embed = new EmbedBuilder()
                .setColor(0xff_92_00)
                .setTitle(`${user.steamName}'s Stats`)
                .setURL(`${ZEEPKIST_URL}/user/${user.steamId}`)
                .setThumbnail(steamUser.avatarfull)
                .addFields({
                name: 'World Records',
                value: `${worldRecords.totalAmount} ${userRankingPosition}`.trim(),
                inline: true
            }, {
                name: 'Best Times',
                value: `${bestRecords.totalAmount}`,
                inline: true
            }, {
                name: 'any% Times',
                value: `${allInvalidRecords.totalAmount}`,
                inline: true
            }, {
                name: 'Total Runs',
                value: `${totalRuns}`,
                inline: true
            }, {
                name: 'Levels Created',
                value: `${levelsCreated.totalAmount}+`,
                inline: true
            })
                .setTimestamp()
                .setFooter({ text: 'Data provided by Zeepkist GTR' });
            log.info('Created embed.', interaction);
            if (steamUser.loccountrycode) {
                log.info(`Adding ${steamUser.loccountrycode} country flag to embed.`, interaction);
                embed.addFields({
                    name: 'Country',
                    value: formatFlagEmoji(steamUser.loccountrycode),
                    inline: true
                });
            }
            if ((!linkedAccount || linkedAccount?.length === 0) &&
                userSimilarity(interaction.user.username, [user.steamName]) < 3) {
                log.info('No linked account and user similarity < 3. Prompting user to link account.', interaction);
                const verifyPrompt = `Link your Steam ID with ${inlineCode('/verify')} to use this command without options!`;
                embed.setDescription(verifyPrompt);
            }
            setAuthor: if (linkedAccount &&
                linkedAccount.length > 0 &&
                linkedAccount[0].steamId === user.steamId) {
                addDiscordAuthor(interaction, embed, interaction.user, user.steamId);
            }
            else {
                const findLinkedAccount = await database('linked_accounts')
                    .select('discordId')
                    .where({
                    steamId: user.steamId
                });
                if (!findLinkedAccount || findLinkedAccount.length === 0) {
                    break setAuthor;
                }
                const linkedUser = await interaction.client.users.fetch(findLinkedAccount[0].discordId);
                addDiscordAuthor(interaction, embed, linkedUser, user.steamId);
            }
            log.info(`Getting world records for ${user.steamId}`, interaction);
            const worldRecordsList = listRecords({
                records: worldRecords.records,
                showLevel: true,
                showMedal: true
            });
            if (worldRecordsList.length > 0) {
                embed.addFields({
                    name: 'Recent World Records',
                    value: worldRecordsList
                });
            }
            log.info(`Getting best records for ${user.steamId}`, interaction);
            const bestRecordsList = listRecords({
                records: bestRecords.records,
                showLevel: true,
                showMedal: true
            });
            if (bestRecordsList.length > 0) {
                embed.addFields({
                    name: 'Recent Bests',
                    value: bestRecordsList
                });
            }
            log.info(`Getting any% records for ${user.steamId}`, interaction);
            const anyPercentRecordsList = listRecords({
                records: allInvalidRecords.records.filter(record => !record.isValid),
                showLevel: true
            });
            if (anyPercentRecordsList.length > 0) {
                embed.addFields({
                    name: 'Recent any% Runs',
                    value: anyPercentRecordsList
                });
            }
            const buttons = new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('More Stats')
                    .setURL(`${ZEEPKIST_URL}/user/${user.steamId}`),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Steam Profile')
                    .setURL(`${STEAM_URL}/profiles/${user.steamId}`)
            ]);
            log.info(`Sending message`, interaction);
            await interaction.editReply({
                embeds: [embed],
                components: [buttons]
            });
        }
        catch (error) {
            const embed = new EmbedBuilder()
                .setColor(0xff_00_00)
                .setTitle('Error')
                .setDescription('An error occurred while fetching user data. Please try again later.');
            if (error instanceof HTTPError) {
                log.error(`${error.response.status} - ${error.response.statusText}`);
                if ([404, 422].includes(error.response?.status)) {
                    embed
                        .setColor(0xff_92_00)
                        .setTitle('User not found')
                        .setDescription('The user you are trying to find does not have the Zeepkist GTR mod installed.');
                }
            }
            else {
                log.error(String(error));
            }
            interaction.editReply({
                embeds: [embed]
            });
        }
    }
};

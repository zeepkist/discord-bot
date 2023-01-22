import { ActionRowBuilder, ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, EmbedBuilder, inlineCode } from 'discord.js';
import { listRecords } from '../components/lists/listRecords.js';
import { database } from '../services/database.js';
import { getLevels } from '../services/levels.js';
import { getRecords } from '../services/records.js';
import { getPlayerSummaries } from '../services/steam.js';
import { getUser, getUserRanking } from '../services/users.js';
import { formatFlagEmoji, formatOrdinal, log, userSimilarity } from '../utils/index.js';
const addDiscordAuthor = (interaction, embed, linkedAccount, steamId) => {
    log.info(interaction, `Adding Discord author: ${linkedAccount.tag}`);
    embed.setAuthor({
        name: linkedAccount.username,
        iconURL: linkedAccount.avatarURL() ?? '',
        url: `https://zeepkist.wopian.me/user/${steamId}`
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
    run: async (interaction) => {
        const linkedAccount = await database('linked_accounts')
            .select('steamId')
            .where({
            discordId: interaction.user.id
        });
        log.info(interaction, `Found ${linkedAccount.length} linked accounts.`);
        let steamId = interaction.options.data.find(option => option.name === 'steamid')?.value;
        const id = interaction.options.data.find(option => option.name === 'id')
            ?.value;
        log.info(interaction, `Steam ID: ${steamId}, ID: ${id}`);
        if ((!linkedAccount || linkedAccount.length === 0) && !steamId && !id) {
            log.info(interaction, 'No linked account or option arguments provided. Ending interaction.');
            await interaction.reply({
                content: `You must provide either a Steam ID or a user ID.\n\nIf you link your Steam account with ${inlineCode('/verify')}, you can use this command without providing a Steam ID or user ID.`,
                ephemeral: true
            });
            return;
        }
        if (!steamId && !id) {
            steamId = linkedAccount[0].steamId;
            log.info(interaction, `Using linked account Steam ID: ${steamId}`);
        }
        try {
            const user = await getUser({ SteamId: steamId, Id: id });
            log.info(interaction, `Found user: ${user.steamName}`);
            const steamPlayerSummary = await getPlayerSummaries([user.steamId]);
            const steamUser = steamPlayerSummary.response.players[0];
            log.info(interaction, `Found Steam player summary. Private: ${steamUser.communityvisibilitystate === 1}`);
            const levelsCreated = await getLevels({
                Author: user.steamName,
                Limit: 0
            });
            log.info(interaction, `Found ${levelsCreated.totalAmount} levels created by ${user.steamName}.`);
            let userRanking;
            try {
                userRanking = await getUserRanking({ SteamId: user.steamId });
                log.info(interaction, `Found user ranking: ${userRanking.position}`);
            }
            catch (error) {
                if (error.response?.status === 404) {
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
            log.info(interaction, `Found ${allValidRecords.totalAmount} valid records.`);
            const allInvalidRecords = await getRecords({
                UserSteamId: steamId,
                UserId: id,
                InvalidOnly: true,
                Sort: '-id',
                Limit: 5
            });
            log.info(interaction, `Found ${allInvalidRecords.totalAmount} invalid records.`);
            const bestRecords = await getRecords({
                UserSteamId: steamId,
                UserId: id,
                BestOnly: true,
                Sort: '-id',
                Limit: 5
            });
            log.info(interaction, `Found ${bestRecords.totalAmount} best records.`);
            const worldRecords = await getRecords({
                UserSteamId: steamId,
                UserId: id,
                WorldRecordOnly: true,
                Sort: '-id',
                Limit: 5
            });
            log.info(interaction, `Found ${worldRecords.totalAmount} world records.`);
            const totalRuns = allValidRecords.totalAmount + allInvalidRecords.totalAmount;
            log.info(interaction, `Found ${totalRuns} total runs.`);
            const embed = new EmbedBuilder()
                .setColor(0xff_92_00)
                .setTitle(`${user.steamName}'s Stats`)
                .setURL(`https://zeepkist.wopian.me/user/${user.steamId}`)
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
            log.info(interaction, 'Created embed.');
            if (steamUser.loccountrycode) {
                log.info(interaction, `Adding ${steamUser.loccountrycode} country flag to embed.`);
                embed.addFields({
                    name: 'Country',
                    value: formatFlagEmoji(steamUser.loccountrycode),
                    inline: true
                });
            }
            if ((!linkedAccount || linkedAccount?.length === 0) &&
                userSimilarity(interaction.user.username, [user.steamName]) < 3) {
                log.info(interaction, 'No linked account and user similarity < 3. Prompting user to link account.');
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
                    .setURL(`https://zeepkist.wopian.me/user/${user.steamId}`),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Steam Profile')
                    .setURL(`https://steamcommunity.com/profiles/${user.steamId}`)
            ]);
            await interaction.reply({
                embeds: [embed],
                components: [buttons]
            });
        }
        catch (error) {
            console.error(error.response?.status === 404 ? String(error) : error);
            await (error.response?.status === 404
                ? interaction.reply({
                    ephemeral: true,
                    content: 'User not found.'
                })
                : interaction.reply({
                    ephemeral: true,
                    content: 'An error occurred while fetching user data. Please try again later.'
                }));
        }
    }
};

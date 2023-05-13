import { getLevels, getRecords, getUserRanking } from '@zeepkist/gtr-api';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { HTTPError } from 'ky-universal';
import { STEAM_URL, ZEEPKIST_URL } from '../../constants.js';
import { getPlayerSummaries } from '../../services/steam.js';
import { formatOrdinal, log } from '../../utils/index.js';
import { listRecords } from '../lists/listRecords.js';
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
export const userEmbed = async (interaction, user, discordUser) => {
    try {
        const levelsCreated = await getLevels({
            Author: user.steamName,
            Limit: 0
        });
        log.info(`Found ${levelsCreated.totalAmount} levels created by ${user.steamName}.`, interaction);
        let userRanking;
        try {
            userRanking = await getUserRanking(user.id);
            log.info(`Found user ranking: ${userRanking.position}`, interaction);
        }
        catch (error) {
            if (error instanceof HTTPError && error.response.status === 404) {
                userRanking = {
                    position: 0,
                    score: 0,
                    amountOfWorldRecords: 0
                };
            }
            else {
                throw error;
            }
        }
        const userRankingScore = Math.floor(userRanking.score);
        const userRankingPosition = userRanking.position
            ? `(${formatOrdinal(userRanking.position)})`
            : '';
        const allValidRecords = await getRecords({
            UserSteamId: user.steamId,
            ValidOnly: true,
            Limit: 0
        });
        log.info(`Found ${allValidRecords.totalAmount} valid records.`, interaction);
        const allInvalidRecords = await getRecords({
            UserSteamId: user.steamId,
            InvalidOnly: true,
            Sort: '-id',
            Limit: 5
        });
        log.info(`Found ${allInvalidRecords.totalAmount} invalid records.`, interaction);
        const bestRecords = await getRecords({
            UserSteamId: user.steamId,
            BestOnly: true,
            Sort: '-id',
            Limit: 5
        });
        log.info(`Found ${bestRecords.totalAmount} best records.`, interaction);
        const worldRecords = await getRecords({
            UserSteamId: user.steamId,
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
            .addFields({
            name: 'Points',
            value: `${userRankingScore} ${userRankingPosition}`.trim(),
            inline: true
        }, {
            name: 'World Records',
            value: `${worldRecords.totalAmount}`,
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
        try {
            const steamPlayerSummary = await getPlayerSummaries([user.steamId]);
            const steamUser = steamPlayerSummary.response.players[0];
            log.info(`Found Steam player summary. Private: ${steamUser.communityvisibilitystate === 1}`, interaction);
            embed.setThumbnail(steamUser.avatarfull);
        }
        catch (error) {
            log.error(`Failed to get Steam player summary - ${String(error)}`, interaction);
        }
        if (user.discordId) {
            addDiscordAuthor(interaction, embed, discordUser || interaction.user, user.steamId);
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
};

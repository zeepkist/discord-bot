import { getLevels, getRecords, getStats, getUserRanking } from '@zeepkist/gtr-api';
import { HTTPError } from 'ky-universal';
import { formatOrdinal, log, toDistance, toDuration } from '../../../utils/index.js';
export const userEmbedStats = async (interaction, user, embed) => {
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
        Limit: 0
    });
    log.info(`Found ${allInvalidRecords.totalAmount} invalid records.`, interaction);
    const bestRecords = await getRecords({
        UserSteamId: user.steamId,
        BestOnly: true,
        Limit: 0
    });
    log.info(`Found ${bestRecords.totalAmount} best records.`, interaction);
    const worldRecords = await getRecords({
        UserSteamId: user.steamId,
        WorldRecordOnly: true,
        Limit: 0
    });
    log.info(`Found ${worldRecords.totalAmount} world records.`, interaction);
    const totalRuns = allValidRecords.totalAmount + allInvalidRecords.totalAmount;
    log.info(`Found ${totalRuns} total runs.`, interaction);
    embed.addFields({
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
    });
    try {
        const date = new Date();
        const stats = await getStats({ UserId: user.id });
        let statsMonth;
        try {
            statsMonth = await getStats({
                UserId: user.id,
                Month: date.getMonth() + 1,
                Year: date.getFullYear()
            });
        }
        catch {
            statsMonth = {
                month: -1,
                year: -1,
                timesStarted: 0,
                timesFinished: 0,
                checkpointsCrossed: 0,
                wheelsBroken: 0,
                crashTotal: 0,
                crashRegular: 0,
                crashEye: 0,
                crashGhost: 0,
                crashSticky: 0,
                distanceGrounded: 0,
                distanceOnGrass: 0,
                distanceOnIce: 0,
                distanceOnRegular: 0,
                distanceInAir: 0,
                distanceArmsUp: 0,
                distanceBraking: 0,
                distanceRagdoll: 0,
                distanceOnFourWheels: 0,
                distanceOnThreeWheels: 0,
                distanceOnTwoWheels: 0,
                distanceOnOneWheel: 0,
                distanceOnNoWheels: 0,
                distanceWithFourWheels: 0,
                distanceWithThreeWheels: 0,
                distanceWithTwoWheels: 0,
                distanceWithOneWheel: 0,
                distanceWithNoWheels: 0,
                timeGrounded: 0,
                timeOnGrass: 0,
                timeOnIce: 0,
                timeOnRegular: 0,
                timeInAir: 0,
                timeArmsUp: 0,
                timeBraking: 0,
                timeRagdoll: 0,
                timeOnFourWheels: 0,
                timeOnThreeWheels: 0,
                timeOnTwoWheels: 0,
                timeOnOneWheel: 0,
                timeOnNoWheels: 0,
                timeWithFourWheels: 0,
                timeWithThreeWheels: 0,
                timeWithTwoWheels: 0,
                timeWithOneWheel: 0,
                timeWithNoWheels: 0
            };
        }
        embed.addFields({
            name: 'Statistics (This Month)',
            value: '\n',
            inline: false
        }, {
            name: 'Starts',
            value: `${stats.timesStarted} (${statsMonth.timesStarted})`,
            inline: true
        }, {
            name: 'Finishes',
            value: `${stats.timesFinished} (${statsMonth.timesFinished})`,
            inline: true
        }, {
            name: 'Checkpoints',
            value: `${stats.checkpointsCrossed} (${statsMonth.checkpointsCrossed})`,
            inline: true
        }, {
            name: 'Wheels Lost',
            value: `${stats.wheelsBroken} (${statsMonth.wheelsBroken})`,
            inline: true
        }, {
            name: 'Crashes',
            value: `${stats.crashTotal} (${statsMonth.crashTotal})`,
            inline: true
        });
        if (stats.crashTotal > stats.crashRegular) {
            embed.addFields({
                name: 'Crashes (Regular)',
                value: `${stats.crashRegular} (${statsMonth.crashRegular})`,
                inline: true
            });
        }
        if (stats.crashEye) {
            embed.addFields({
                name: 'Crashes (Eye)',
                value: `${stats.crashEye} (${statsMonth.crashEye})`,
                inline: true
            });
        }
        if (stats.crashGhost) {
            embed.addFields({
                name: 'Crashes (Ghost)',
                value: `${stats.crashGhost} (${statsMonth.crashGhost})`,
                inline: true
            });
        }
        if (stats.crashSticky) {
            embed.addFields({
                name: 'Crashes (Web)',
                value: `${stats.crashSticky} (${statsMonth.crashSticky})`,
                inline: true
            });
        }
        const distanceTravelled = `${toDistance(stats.distanceGrounded)} on ground (${toDistance(statsMonth.distanceGrounded)})` +
            `\n${toDistance(stats.distanceOnGrass)} on grass (${toDistance(statsMonth.distanceOnGrass)})` +
            `\n${toDistance(stats.distanceOnIce)} on ice (${toDistance(statsMonth.distanceOnIce)})` +
            `\n${toDistance(stats.distanceOnRegular)} on other surfaces (${toDistance(statsMonth.distanceOnRegular)})` +
            `\n${toDistance(stats.distanceInAir)} in air (${toDistance(statsMonth.distanceInAir)})` +
            `\n${toDistance(stats.distanceArmsUp)} arms up (${toDistance(statsMonth.distanceArmsUp)})` +
            `\n${toDistance(stats.distanceBraking)} braking (${toDistance(statsMonth.distanceBraking)})` +
            `\n${toDistance(stats.distanceRagdoll)} ragdolling (${toDistance(statsMonth.distanceRagdoll)})` +
            `\n${toDistance(stats.distanceWithFourWheels)} with four wheels (${toDistance(statsMonth.distanceWithFourWheels)})` +
            `\n${toDistance(stats.distanceWithThreeWheels)} with three wheels (${toDistance(statsMonth.distanceWithThreeWheels)})` +
            `\n${toDistance(stats.distanceWithTwoWheels)} with two wheels (${toDistance(statsMonth.distanceWithTwoWheels)})` +
            `\n${toDistance(stats.distanceWithOneWheel)} with one wheel (${toDistance(statsMonth.distanceWithOneWheel)})` +
            `\n${toDistance(stats.distanceWithNoWheels)} with no wheels (${toDistance(statsMonth.distanceWithNoWheels)})`;
        const timeSpent = `${toDuration(stats.timeGrounded)} on ground (${toDuration(statsMonth.timeGrounded)})` +
            `\n${toDuration(stats.timeOnGrass)} on grass (${toDuration(statsMonth.timeOnGrass)})` +
            `\n${toDuration(stats.timeOnIce)} on ice (${toDuration(statsMonth.timeOnIce)})` +
            `\n${toDuration(stats.timeOnRegular)} on other surfaces (${toDuration(statsMonth.timeOnRegular)})` +
            `\n${toDuration(stats.timeInAir)} in air (${toDuration(statsMonth.timeInAir)})` +
            `\n${toDuration(stats.timeArmsUp)} arms up (${toDuration(statsMonth.timeArmsUp)})` +
            `\n${toDuration(stats.timeBraking)} braking (${toDuration(statsMonth.timeBraking)})` +
            `\n${toDuration(stats.timeRagdoll)} ragdolling (${toDuration(statsMonth.timeRagdoll)})` +
            `\n${toDuration(stats.timeWithFourWheels)} with four wheels (${toDuration(statsMonth.timeWithFourWheels)})` +
            `\n${toDuration(stats.timeWithThreeWheels)} with three wheels (${toDuration(statsMonth.timeWithThreeWheels)})` +
            `\n${toDuration(stats.timeWithTwoWheels)} with two wheels (${toDuration(statsMonth.timeWithTwoWheels)})` +
            `\n${toDuration(stats.timeWithOneWheel)} with one wheel (${toDuration(statsMonth.timeWithOneWheel)})` +
            `\n${toDuration(stats.timeWithNoWheels)} with no wheels (${toDuration(statsMonth.timeWithNoWheels)})`;
        embed.addFields({
            name: 'Distance Travelled',
            value: distanceTravelled,
            inline: false
        }, {
            name: 'Time Spent',
            value: timeSpent,
            inline: false
        });
    }
    catch (error) {
        log.info(`User has no stats yet, ${error}`, interaction);
        console.debug(error);
    }
};

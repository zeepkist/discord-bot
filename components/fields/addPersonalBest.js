import { getRecords } from '@zeepkist/gtr-api';
import { inlineCode } from 'discord.js';
import { database } from '../../services/database.js';
import { bestMedal, formatRelativeDate, formatResultTime, log, userSimilarity } from '../../utils/index.js';
const verifyPrompt = async ({ embed }) => {
    embed.addFields({
        name: 'Verify your Steam account',
        value: `with ${inlineCode('/verify')} to see your personal best here`,
        inline: true
    });
    return;
};
export const addPersonalBest = async ({ interaction, embed, levelId, discordName, steamNames }) => {
    const user = await database('linked_accounts')
        .where({ discordId: interaction.user.id })
        .select('steamId')
        .first();
    if (!user &&
        steamNames.length >= 5 &&
        userSimilarity(discordName, steamNames) > 3) {
        log.info(`No linked user and a similar user isn't on page 1. Showing verify prompt`, interaction);
        return verifyPrompt({
            embed,
            discordName,
            steamNames
        });
    }
    else if (!user)
        return;
    log.info(`Getting user records for ${user.steamId} on level ${levelId}`, interaction);
    const userRecords = await getRecords({
        LevelId: levelId,
        UserSteamId: user.steamId,
        BestOnly: true
    });
    if (!userRecords || userRecords.records.length === 0)
        return;
    log.info(`Found personal best for ${user.steamId} on level ${levelId}`, interaction);
    const userRecord = userRecords.records[0];
    const formattedUserRecord = `${bestMedal(userRecord)} ${inlineCode(formatResultTime(userRecord.time))}\n${formatRelativeDate(userRecord.dateCreated)} with ${userRecords.totalAmount} run${userRecords.totalAmount === 1 ? '' : 's'} so far`;
    embed.addFields({
        name: 'Your Personal Best',
        value: formattedUserRecord,
        inline: true
    });
};

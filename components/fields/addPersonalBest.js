import { getRecords, getUserByDiscordId } from '@zeepkist/gtr-api';
import { inlineCode } from 'discord.js';
import { bestMedal, formatRelativeDate, formatResultTime, log } from '../../utils/index.js';
export const addPersonalBest = async ({ interaction, embed, levelId }) => {
    try {
        const user = await getUserByDiscordId(interaction.user.id);
        if (!user)
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
    }
    catch (error) {
        log.error(String(error), interaction);
    }
};

import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, inlineCode } from 'discord.js';
import { listRecords } from '../components/lists/listRecords.js';
import { database } from '../services/database.js';
import { getRecords } from '../services/records.js';
import { getUser, getUserRanking } from '../services/users.js';
import { formatOrdinal, userSimilarity } from '../utils/index.js';
const addDiscordAuthor = (embed, linkedAccount, steamId) => {
    embed.setAuthor({
        name: linkedAccount.username,
        iconURL: linkedAccount.avatarURL() ?? '',
        url: `https://zeepkist.wopian.me/user/${steamId}`
    });
    embed.setThumbnail(linkedAccount.avatarURL() ?? '');
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
            minLength: 1
        }
    ],
    run: async (interaction) => {
        const linkedAccount = await database('linked_accounts')
            .select('steamId')
            .where({
            discordId: interaction.user.id
        });
        let steamId = interaction.options.data.find(option => option.name === 'steamid')?.value;
        const id = interaction.options.data.find(option => option.name === 'id')
            ?.value;
        if ((!linkedAccount || linkedAccount.length === 0) && !steamId && !id) {
            await interaction.reply({
                content: `You must provide either a Steam ID or a user ID.\n\nIf you link your Steam account with ${inlineCode('/verify')}, you can use this command without providing a Steam ID or user ID.`,
                ephemeral: true
            });
            return;
        }
        if (!steamId && !id) {
            steamId = linkedAccount[0].steamId;
        }
        try {
            const user = await getUser({ SteamId: steamId, Id: id });
            let userRanking;
            try {
                userRanking = await getUserRanking({ SteamId: user.steamId });
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
                InvalidOnly: true,
                Sort: '-id',
                Limit: 5
            });
            const allInvalidRecords = await getRecords({
                UserSteamId: steamId,
                UserId: id,
                InvalidOnly: true,
                Sort: '-id',
                Limit: 5
            });
            const bestRecords = await getRecords({
                UserSteamId: steamId,
                UserId: id,
                BestOnly: true,
                Sort: '-id',
                Limit: 5
            });
            const worldRecords = await getRecords({
                UserSteamId: steamId,
                UserId: id,
                WorldRecordOnly: true,
                Sort: '-id',
                Limit: 5
            });
            const totalRuns = allValidRecords.totalAmount + allInvalidRecords.totalAmount;
            const embed = new EmbedBuilder()
                .setColor(0xff_92_00)
                .setTitle(`${user.steamName}'s Stats`)
                .setURL(`https://zeepkist.wopian.me/user/${user.steamId}`)
                .addFields({
                name: 'World Records',
                value: `${worldRecords.totalAmount} ${userRankingPosition}`.trim(),
                inline: true
            }, {
                name: 'Best Times',
                value: String(bestRecords.totalAmount),
                inline: true
            }, {
                name: 'any% Times',
                value: String(allValidRecords.totalAmount),
                inline: true
            }, {
                name: 'Total Runs',
                value: String(totalRuns),
                inline: true
            })
                .setTimestamp()
                .setFooter({ text: 'Data provided by Zeepkist GTR' });
            if ((!linkedAccount || linkedAccount?.length === 0) &&
                userSimilarity(interaction.user.username, [user.steamName]) < 3) {
                const verifyPrompt = `Link your Steam ID with ${inlineCode('/verify')} to use this command without options!`;
                embed.setDescription(verifyPrompt);
            }
            setAuthor: if (linkedAccount &&
                linkedAccount.length > 0 &&
                linkedAccount[0].steamId === user.steamId) {
                addDiscordAuthor(embed, interaction.user, user.steamId);
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
                addDiscordAuthor(embed, linkedUser, user.steamId);
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
            await interaction.reply({
                embeds: [embed]
            });
        }
        catch (error) {
            console.error(String(error));
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

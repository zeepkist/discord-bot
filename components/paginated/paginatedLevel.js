import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { getRecords } from '../../services/records.js';
import { addMedalTimes } from '../fields/addMedalTimes.js';
import { addPersonalBest } from '../fields/addPersonalBest.js';
import { listRecords } from '../lists/listRecords.js';
import { getPaginatedData, sendPaginatedMessage } from '../paginated.js';
export const paginatedLevel = async (properties) => {
    const limit = 5;
    const { interaction } = properties;
    const data = await getPaginatedData({ ...properties, limit });
    const { records, totalAmount } = await getRecords({
        Limit: limit,
        Offset: data.offset,
        BestOnly: true,
        LevelId: data.query?.id
    });
    const level = records[0]?.level;
    const recordsList = listRecords({
        records: records,
        offset: data.offset,
        showRank: true,
        showUser: true,
        showMedal: true
    });
    const embed = new EmbedBuilder().setTitle(`${level.name}`).setAuthor({
        name: level.author
    });
    if (level.thumbnailUrl) {
        embed.setThumbnail(level.thumbnailUrl.replaceAll(' ', '%20'));
    }
    await addMedalTimes({ interaction, embed, level });
    await addPersonalBest({
        interaction,
        embed,
        levelId: level.id,
        discordName: interaction.user.username,
        steamNames: records.map(({ user }) => user.steamName)
    });
    embed.addFields({
        name: 'Best Times',
        value: recordsList ?? 'No recent records.'
    });
    const buttons = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('More Stats')
            .setURL(`https://zeepkist.wopian.me/level/${level.id}`)
    ]);
    if (level.workshopId !== '0') {
        buttons.addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Subscribe to Level')
                .setURL(`https://steamcommunity.com/sharedfiles/filedetails/?id=${level.workshopId}`)
        ]);
    }
    if (level.workshopId === '0' && level.author === 'Yannic') {
        let wikiName = level.name.replaceAll('Level ', '');
        if (wikiName.length === 2)
            wikiName = `Level%20${wikiName}`;
        buttons.addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('View Cosmetic Unlocks')
                .setURL(`https://zeepkist.fandom.com/wiki/${wikiName}`)
        ]);
    }
    await sendPaginatedMessage({
        customId: 'level',
        interaction,
        embed,
        components: [buttons],
        query: data.query,
        currentPage: data.currentPage,
        totalAmount,
        limit
    });
};

import { EmbedBuilder, inlineCode, italic } from 'discord.js'

import { database } from '../services/database.js'
import { getRecords } from '../services/records.js'
import {
  bestMedal,
  formatRelativeDate,
  formatResultTime,
  MEDAL,
  providedBy,
  userSimilarity
} from '../utils/index.js'
import { listRecords } from './lists/listRecords.js'

export const levelRecords = async (
  interaction,
  level,
  page = 1,
  limit = 10
) => {
  const user = await database('linked_accounts')
    .select('steamId')
    .where({
      discordId: String(interaction.user.id)
    })
  console.log(user)
  const records = await getRecords({
    LevelId: level.id,
    BestOnly: true,
    Offset: (page - 1) * limit,
    Limit: limit
  })
  const totalPages = Math.ceil(records.totalAmount / limit)
  const embed = new EmbedBuilder()
    .setColor(0xff_92_00)
    .setTitle(`${level.name}`)
    .setFooter({
      text: `Page ${page} of ${totalPages}. ${providedBy}`
    })
    .setTimestamp()
    .setURL(`https://zeepkist.wopian.me/level/${level.id}`)
    .setAuthor({
      name: level.author
    })
  const medalTimes = [
    level.timeAuthor &&
      `${MEDAL.AUTHOR} ${inlineCode(formatResultTime(level.timeAuthor))}`,
    level.timeGold &&
      `${MEDAL.GOLD} ${inlineCode(formatResultTime(level.timeGold))}`,
    level.timeSilver &&
      `${MEDAL.SILVER} ${inlineCode(formatResultTime(level.timeSilver))}`,
    level.timeBronze &&
      `${MEDAL.BRONZE} ${inlineCode(formatResultTime(level.timeBronze))}`
  ].join('\n')
  embed.addFields({
    name: 'Medal Times',
    value: medalTimes,
    inline: true
  })
  handleUserRecords: if (user && user.length > 0) {
    const userRecord = await getRecords({
      LevelId: level.id,
      UserSteamId: user[0].steamId,
      BestOnly: true
    })
    if (!userRecord || userRecord.records.length === 0) {
      break handleUserRecords
    }
    const record = userRecord.records[0]
    const personalBest = `${bestMedal(record)} ${inlineCode(
      formatResultTime(record.time)
    )}\n${formatRelativeDate(record.dateCreated)} with ${
      userRecord.totalAmount
    } total runs`
    embed.addFields({
      name: 'Your Personal Best',
      value: personalBest,
      inline: true
    })
  }
  let bestRecords = listRecords({
    records: records.records,
    showRank: true,
    showUser: true,
    showMedal: true
  })
  if (records.totalAmount > limit) {
    bestRecords += `\n\n${italic('Only the first 10 records are shown.')}`
    if (
      (!user || user.length === 0) &&
      userSimilarity(
        interaction.user.username,
        records.records.map(({ user }) => user.steamName)
      ) > 3
    ) {
      bestRecords += `\n\nLink your Steam ID with ${inlineCode(
        '/verify'
      )} to always see your personal best.`
    }
  }
  embed.addFields({
    name: 'Best Times',
    value: bestRecords ?? 'No records have been set yet.'
  })
  if (level.thumbnailUrl) {
    embed.setThumbnail(level.thumbnailUrl.replace(' ', '%20'))
  }
  return { embeds: [embed], components: [] }
}

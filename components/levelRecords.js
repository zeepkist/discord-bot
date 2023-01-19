import { bold, EmbedBuilder, hyperlink, inlineCode, italic } from 'discord.js'

import { getRecords } from '../services/records.js'
import {
  formatRelativeDate,
  formatResultTime,
  providedBy
} from '../utils/index.js'

export const levelRecords = async (
  interaction,
  level,
  page = 1,
  limit = 10
) => {
  const records = await getRecords({
    LevelId: level.id,
    BestOnly: true,
    Offset: (page - 1) * limit,
    Limit: limit
  })
  const totalPages = Math.ceil(records.totalAmount / limit)
  let recordsList = records.records
    .map((record, index) => {
      const recordNumber = bold(`${index + 1}.`)
      const recordTime = inlineCode(formatResultTime(record.time))
      const recordUser = hyperlink(
        record.user.steamName,
        `https://zeepkist.wopian.me/user/${record.user.steamId}`
      )
      const recordDate = formatRelativeDate(record.dateCreated)
      return `${recordNumber} ${recordTime} by ${recordUser} (${recordDate})`
    })
    .join('\n')
  if (records.totalAmount > limit) {
    recordsList += `\n\n${italic('Only the first 10 levels are shown.')}`
  }
  const medalTimes = [
    level.timeAuthor &&
      `<:zeepkist_author:1008786679173234688> ${inlineCode(
        formatResultTime(level.timeAuthor)
      )}`,
    level.timeGold &&
      `<:zeepkist_gold:1008786743706783826> ${inlineCode(
        formatResultTime(level.timeGold)
      )}`,
    level.timeSilver &&
      `<:zeepkist_silver:1008786769380130959> ${inlineCode(
        formatResultTime(level.timeSilver)
      )}`,
    level.timeBronze &&
      `<:zeepkist_bronze:1008786713688166400> ${inlineCode(
        formatResultTime(level.timeBronze)
      )}`
  ].join('\n')
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
    .addFields(
      {
        name: 'Medal Times',
        value: medalTimes
      },
      {
        name: 'Best Times',
        value: recordsList ?? 'No records recorded.'
      }
    )
  if (level.thumbnailUrl) embed.setThumbnail(level.thumbnailUrl)
  return { embeds: [embed], components: [] }
}

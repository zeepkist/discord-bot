import {
  bold,
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
  hyperlink,
  inlineCode,
  italic
} from 'discord.js'

import { LinkedAccount } from '../models/database/linkedAccounts.js'
import { Level } from '../models/level.js'
import { database } from '../services/database.js'
import { getRecords } from '../services/records.js'
import {
  formatRelativeDate,
  formatResultTime,
  providedBy
} from '../utils/index.js'
// import { paginationButtons } from './paginationButtons.js'

export const levelRecords = async (
  interaction: CommandInteraction | ButtonInteraction,
  level: Level,
  page = 1,
  limit = 10
) => {
  const user = await database<LinkedAccount>('linked_accounts')
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

  embed.addFields({
    name: 'Medal Times',
    value: medalTimes,
    inline: true
  })

  if (user && user.length > 0) {
    const userRecord = await getRecords({
      LevelId: level.id,
      UserSteamId: user[0].steamId,
      BestOnly: true
    })

    console.log(userRecord)

    if (userRecord && userRecord.records.length > 0) {
      const record = userRecord.records[0]

      let bestMedal
      if (record.isWorldRecord) bestMedal = 'WR '
      else if (record.time < level.timeAuthor)
        bestMedal = '<:zeepkist_author:1008786679173234688> '
      else if (record.time < level.timeGold)
        bestMedal = '<:zeepkist_gold:1008786743706783826> '
      else if (record.time < level.timeSilver)
        bestMedal = '<:zeepkist_silver:1008786769380130959> '
      else if (record.time < level.timeBronze)
        bestMedal = '<:zeepkist_bronze:1008786713688166400> '

      const personalBest = `${bestMedal}${inlineCode(
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
  }

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

  embed.addFields({
    name: 'Best Times',
    value: recordsList ?? 'No records recorded.'
  })

  if (level.thumbnailUrl) {
    embed.setThumbnail(level.thumbnailUrl.replace(' ', '%20'))
  }

  // const pagination = paginationButtons(interaction, 'level', page, totalPages)

  return { embeds: [embed], components: [] } // components: pagination ? [pagination] : [] }
}

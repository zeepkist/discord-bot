import {
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
  inlineCode,
  italic
} from 'discord.js'
import { distance } from 'fastest-levenshtein'

import { LinkedAccount } from '../models/database/linkedAccounts.js'
import { Level } from '../models/level.js'
import { database } from '../services/database.js'
import { getRecords } from '../services/records.js'
import {
  formatRelativeDate,
  formatResultTime,
  providedBy
} from '../utils/index.js'
import { listRecords } from './lists/listRecords.js'
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

  let bestRecords = listRecords({
    records: records.records,
    showRank: true,
    showUser: true,
    showMedal: true
  })

  if (records.totalAmount > limit) {
    bestRecords += `\n\n${italic('Only the first 10 records are shown.')}`

    if (!user || user.length === 0) {
      const discordName = interaction.user.username
        .toLowerCase()
        .replaceAll(/\[.*]/, '')
      const userSimilarity = records.records
        .map(({ user }) => {
          const steamName = user.steamName.toLowerCase().replaceAll(/\[.*]/, '')
          return distance(discordName, steamName)
        })
        .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)
      if (userSimilarity > 3) {
        bestRecords += `\n\nLink your Steam ID with ${inlineCode(
          '/verify'
        )} to always see your personal best.`
      }
    }
  }

  embed.addFields({
    name: 'Best Times',
    value: bestRecords ?? 'No records have been set yet.'
  })

  if (level.thumbnailUrl) {
    embed.setThumbnail(level.thumbnailUrl.replace(' ', '%20'))
  }

  // const pagination = paginationButtons(interaction, 'level', page, totalPages)

  return { embeds: [embed], components: [] } // components: pagination ? [pagination] : [] }
}

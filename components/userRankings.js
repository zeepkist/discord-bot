import { bold, EmbedBuilder, hyperlink } from 'discord.js'

import { getUserRankings } from '../services/users.js'
import { providedBy } from '../utils/providedBy.js'

export const userRankings = async (interaction, page = 1, limit = 10) => {
  const offset = (page - 1) * limit
  const cutoff = page * limit
  const rankings = await getUserRankings({ Offset: offset, Limit: cutoff })
  const totalPages = Math.ceil(rankings.totalAmount / limit)
  console.log(
    `[ranking]: Obtained ${rankings.rankings.length} users. ${page}/${totalPages} pages.`
  )
  const rankingsList = rankings.rankings
    .map(ranking => {
      const rankingNumber = bold(`${ranking.position}.`)
      const rankingUser = hyperlink(
        ranking.user.steamName,
        `https://zeepkist.wopian.me/user/${ranking.user.steamId}`
      )
      const rankingWRs = bold(String(ranking.amountOfWorldRecords))
      return `${rankingNumber} ${rankingUser} has ${rankingWRs} world records`
    })
    .join('\n')
  const embed = new EmbedBuilder()
    .setColor(0xff_92_00)
    .setTitle(`Players with the most world records`)
    .setDescription(rankingsList ?? 'No users.')
    .setFooter({
      text: `Page ${page} of ${totalPages}. ${providedBy}`
    })
    .setTimestamp()
  return {
    embeds: [embed],
    components: []
  }
}

import { bold } from 'discord.js'

import { UserRankings } from '../../models/user.js'
import { formatRank, formatUser } from '../../utils/index.js'

interface RankingProperties {
  rankings: UserRankings[]
  offset?: number
}

export const listRankings = ({
  rankings,
  offset = 0
}: RankingProperties): string =>
  rankings
    .map((ranking, index) => {
      const rank = formatRank(index + 1 + offset)
      const user = formatUser(ranking.user)
      const wrs = bold(String(ranking.amountOfWorldRecords))
      return `${rank} ${user} has ${wrs} world record${
        ranking.amountOfWorldRecords === 1 ? '' : 's'
      }`
    })
    .join('\n')

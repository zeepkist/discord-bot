import { PAGINATION_LIMIT } from '../config/index.js'
import { PaginatedButtonTypeEnum } from '../enums/index.js'
import { getRankings } from '../services/getRankings.js'
import { createEmbed, formatRank, formatUser } from '../utils/index.js'
import {
  getPaginatedData,
  PaginatedData,
  sendPaginatedMessage
} from './paginated.js'

export const createLeaderboard = async (properties: PaginatedData) => {
  const { interaction } = properties
  const data = await getPaginatedData(properties)
  const rankings = await getRankings(data.offset)

  const totalPages = Math.ceil(
    (rankings?.totalCount ?? PAGINATION_LIMIT) / PAGINATION_LIMIT
  )

  const embed = createEmbed(`Zeepkist GTR Leaderboard`)

  const description = rankings?.nodes.map(ranking => {
    if (!ranking || !ranking.userByUser) return

    const { userByUser: user, rank, points } = ranking
    const discordTag = user.discordId ? `<@${user.discordId}>` : ''
    const formattedPoints = points.toLocaleString()

    return `${formatRank(rank)} ${formatUser(
      user
    )} ${discordTag} (${formattedPoints} points)`
  })

  embed.setFooter({
    text: `Page ${data.currentPage} of ${totalPages}`
  })

  embed.setDescription(description?.join('\n') ?? 'No rankings found')

  console.debug(data)

  await sendPaginatedMessage({
    customId: PaginatedButtonTypeEnum.Leaderboard,
    interaction,
    embed,
    query: data.query,
    currentPage: data.currentPage,
    totalAmount: rankings?.totalCount ?? PAGINATION_LIMIT
  })
}

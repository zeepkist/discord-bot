import { gtr } from '@zeepkist/graphql'
import { enumPlayerPointsOrderBy } from '@zeepkist/graphql/gtr'

import { PAGINATION_LIMIT } from '../config/index.js'

export const getRankings = async (offset: number) => {
  const response = await gtr.query({
    allPlayerPoints: {
      __args: {
        first: PAGINATION_LIMIT,
        offset: offset,
        orderBy: [enumPlayerPointsOrderBy.POINTS_DESC]
      },
      totalCount: true,
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: true
      },
      nodes: {
        points: true,
        rank: true,
        userByUser: {
          discordId: true,
          steamId: true,
          steamName: true
        }
      }
    }
  })

  return response.allPlayerPoints
}

import { EmbedBuilder } from 'discord.js'

import { PAGINATION_LIMIT } from '../../constants.js'
import { getLevels } from '../../services/levels.js'
import { listLevels } from '../lists/listLevels.js'
import {
  getPaginatedData,
  PaginatedData,
  sendPaginatedMessage
} from '../paginated.js'

export const paginatedLevels = async (properties: PaginatedData) => {
  const { interaction } = properties
  const data = await getPaginatedData(properties)

  const { levels, totalAmount } = await getLevels({
    Id: data.query?.id,
    WorkshopId: data.query?.workshopId,
    Author: data.query?.author,
    Name: data.query?.name,
    Limit: PAGINATION_LIMIT,
    Offset: data.offset
  })

  const levelsList = listLevels({
    levels: levels,
    offset: data.offset,
    showRank: true,
    showId: true
  })

  const embed = new EmbedBuilder()
    .setTitle('Level Search Results')
    .setDescription(levelsList ?? 'No levels found')

  await sendPaginatedMessage({
    customId: 'levels',
    interaction,
    embed,
    query: data.query,
    currentPage: data.currentPage,
    totalAmount
  })
}

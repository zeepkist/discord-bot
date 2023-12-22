import { PAGINATION_LIMIT } from '../config/index.js'
import { PaginatedButtonTypeEnum, RecordType } from '../enums/index.js'
import { getRecords } from '../services/getRecords.js'
import {
  bestMedal,
  createEmbed,
  formatDiscordDate,
  formatLevel,
  formatResultTime,
  formatUser
} from '../utils/index.js'
import {
  getPaginatedData,
  PaginatedData,
  sendPaginatedMessage
} from './paginated.js'

export const createRecords = async (properties: PaginatedData) => {
  const { interaction } = properties
  const data = await getPaginatedData(properties)
  const records = await getRecords(data.offset, RecordType.Valid)

  const totalPages = Math.ceil(
    (records?.totalCount ?? PAGINATION_LIMIT) / PAGINATION_LIMIT
  )

  const embed = createEmbed(`Recent Records`)

  const description = records?.nodes.map(record => {
    if (!record || !record.userByUser) return

    const { userByUser: user, dateCreated, time, level, isWorldRecord } = record

    return `${bestMedal(time, level, isWorldRecord)} ${formatResultTime(
      time
    )} ${formatUser(user)} - ${formatLevel(level)} (${formatDiscordDate(
      dateCreated
    )})`
  })

  embed.setFooter({
    text: `Page ${data.currentPage} of ${totalPages}`
  })

  embed.setDescription(description?.join('\n') ?? 'No records found')

  console.debug(data)

  await sendPaginatedMessage({
    customId: PaginatedButtonTypeEnum.Records,
    interaction,
    embed,
    query: data.query,
    currentPage: data.currentPage,
    totalAmount: records?.totalCount ?? PAGINATION_LIMIT
  })
}

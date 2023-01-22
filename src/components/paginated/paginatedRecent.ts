import { ButtonInteraction, CommandInteraction, EmbedBuilder } from 'discord.js'
import { PaginatedButtonAction } from 'src/button.js'

import {
  PaginatedMessage,
  PaginatedMessageQuery
} from '../../models/database/paginatedMessage.js'
import { database } from '../../services/database.js'
import { getRecords } from '../../services/records.js'
import { extractPages, log, providedBy } from '../../utils/index.js'
import { listRecords } from '../lists/listRecords.js'
import { paginationButtons } from '../paginationButtons.js'

const setCurrentPage = (
  action: PaginatedButtonAction,
  currentPage: number,
  totalPages: number
) => {
  switch (action) {
    case 'first': {
      return 1
    }
    case 'previous': {
      return currentPage - 1
    }
    case 'next': {
      return currentPage + 1
    }
    case 'last': {
      return totalPages
    }
  }
}

interface PaginatedRecentProperties {
  interaction: CommandInteraction | ButtonInteraction
  action: PaginatedButtonAction
  query?: PaginatedMessageQuery
  limit?: number
}

export const paginatedRecent = async (
  properties: PaginatedRecentProperties
) => {
  const { interaction, action, query, limit = 10 } = properties

  const isUpdate = interaction.isMessageComponent()
  const messageData = isUpdate
    ? await database<PaginatedMessage>('paginated_messages')
        .where({
          messageId: interaction.message.interaction?.id
        })
        .select('query')
    : undefined

  const worldRecordOnly = messageData
    ? JSON.parse(messageData[0].query as string).worldRecordsOnly
    : query?.worldRecordsOnly ?? false

  let { totalPages, currentPage } = extractPages(
    isUpdate ? interaction.message.embeds[0].footer?.text : undefined
  )

  currentPage = setCurrentPage(action, currentPage, totalPages)
  const offset = (currentPage - 1) * limit

  const { records, totalAmount } = await getRecords({
    Limit: 10,
    Offset: offset,
    BestOnly: true,
    WorldRecordOnly: worldRecordOnly,
    Sort: '-id'
  })

  totalPages = Math.ceil(totalAmount / limit)

  log.info(
    interaction,
    `Obtained ${totalAmount} recent records. Showing page ${currentPage} of ${totalPages}`
  )

  const recentRecords = listRecords({
    records: records,
    offset,
    showRank: true,
    showUser: true,
    showLevel: true,
    showMedal: true
  })

  const embed = new EmbedBuilder()
    .setColor(0xff_92_00)
    .setTitle(`Recent ${worldRecordOnly ? 'World Records' : 'Personal Bests'}`)
    .setDescription(recentRecords ?? 'No recent records.')
    .setFooter({
      text: `Page ${currentPage} of ${totalPages}. ${providedBy}`
    })
    .setTimestamp()

  const pagination = paginationButtons(
    interaction,
    'recent',
    currentPage,
    totalPages
  )

  if (isUpdate) {
    log.info(
      interaction,
      `Updating message ${interaction.message.interaction?.id}`
    )
    await interaction.update({
      embeds: [embed],
      components: pagination ? [pagination] : []
    })
    await database<PaginatedMessage>('paginated_messages')
      .update({
        currentPage,
        updatedAt: new Date(Date.now())
      })
      .where({
        messageId: interaction.message.interaction?.id
      })
  } else {
    log.info(interaction, `Sending new message`)
    const reply = await interaction.reply({
      embeds: [embed],
      components: pagination ? [pagination] : []
    })
    log.info(interaction, `Sent ${reply.interaction.id}`)
    await database<PaginatedMessage>('paginated_messages').insert({
      messageId: reply.interaction.id,
      currentPage,
      query: JSON.stringify(query)
    })
  }
}

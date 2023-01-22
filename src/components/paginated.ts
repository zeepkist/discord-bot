import { ButtonInteraction, CommandInteraction, EmbedBuilder } from 'discord.js'

import { PaginatedButtonAction } from '../button.js'
import { PAGINATION_LIMIT } from '../constants.js'
import {
  PaginatedMessage,
  PaginatedMessageQuery
} from '../models/database/paginatedMessage.js'
import { database } from '../services/database.js'
import { extractPages, log, providedBy } from '../utils/index.js'
import { paginationButtons } from './paginationButtons.js'

export interface PaginatedData {
  interaction: CommandInteraction | ButtonInteraction
  action: PaginatedButtonAction
  query?: PaginatedMessageQuery
}

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
    default: {
      return currentPage
    }
  }
}

export const getPaginatedData = async (properties: PaginatedData) => {
  const { interaction, action, query } = properties

  const isUpdatingMessage = interaction.isMessageComponent()

  const paginatedMessage = isUpdatingMessage
    ? await database<PaginatedMessage>('paginated_messages')
        .where({
          messageId: interaction.message.interaction?.id
        })
        .select('query')
    : [{ query: {} }]
  const activeQuery =
    paginatedMessage.length > 0
      ? (JSON.parse(
          paginatedMessage[0].query as string
        ) as PaginatedMessageQuery)
      : query ?? {}

  const pages = extractPages(
    isUpdatingMessage ? interaction.message.embeds[0].footer?.text : undefined
  )

  const currentPage = setCurrentPage(
    action,
    pages.currentPage,
    pages.totalPages
  )
  const offset = (currentPage - 1) * PAGINATION_LIMIT

  return {
    interactionId: interaction.id,
    query: activeQuery,
    currentPage,
    totalPages: pages.totalPages,
    offset
  }
}

interface SendPaginatedMessage {
  customId: string
  interaction: CommandInteraction | ButtonInteraction
  embed: EmbedBuilder
  query: PaginatedMessageQuery
  currentPage: number
  totalAmount: number
}

export const sendPaginatedMessage = async ({
  customId,
  interaction,
  embed,
  currentPage,
  totalAmount,
  query
}: SendPaginatedMessage) => {
  const totalPages = Math.ceil(totalAmount / PAGINATION_LIMIT)

  log.info(
    interaction,
    `Obtained ${totalAmount} ${customId}. Showing page ${currentPage} of ${totalPages}`
  )

  embed
    .setColor(0xff_92_00)
    .setFooter({
      text: `Page ${currentPage} of ${totalPages}. ${providedBy}`
    })
    .setTimestamp()

  const pagination = paginationButtons(
    interaction,
    customId,
    currentPage,
    totalPages
  )

  const isUpdatingMessage = interaction.isMessageComponent()
  const messageContent = {
    embeds: [embed],
    components: pagination ? [pagination] : []
  }

  if (isUpdatingMessage) {
    log.info(
      interaction,
      `Updating message ${interaction.message.interaction?.id}`
    )
    await interaction.update(messageContent)
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
    const response = await interaction.reply(messageContent)
    await database<PaginatedMessage>('paginated_messages').insert({
      messageId: response.interaction.id,
      query: JSON.stringify(query)
    })
  }
}

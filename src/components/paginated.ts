import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder
} from 'discord.js'

import { PAGINATION_LIMIT } from '../config/index.js'
import { PaginatedButtonActionEnum } from '../enums/index.js'
import { database } from '../services/database.js'
import {
  PaginatedButtonAction,
  PaginatedMessage,
  PaginatedMessageQuery
} from '../types/index.js'
import { extractPages, log, providedBy } from '../utils/index.js'
import { paginatedButtons } from './paginatedButtons.js'

export interface PaginatedData {
  interaction: CommandInteraction | ButtonInteraction
  action: PaginatedButtonAction
  query?: PaginatedMessageQuery
  limit?: number
}

const setCurrentPage = (
  action: PaginatedButtonAction,
  currentPage: number,
  totalPages: number
) => {
  switch (action) {
    case PaginatedButtonActionEnum.First: {
      return 1
    }
    case PaginatedButtonActionEnum.Previous: {
      return currentPage - 1
    }
    case PaginatedButtonActionEnum.Next: {
      return currentPage + 1
    }
    case PaginatedButtonActionEnum.Last: {
      return totalPages
    }
    default: {
      return currentPage
    }
  }
}

export const getPaginatedData = async (properties: PaginatedData) => {
  const { interaction, action, query, limit } = properties

  const isUpdatingMessage = interaction.isMessageComponent()

  const paginatedMessage = isUpdatingMessage
    ? await database<PaginatedMessage>('paginated_messages')
        .where({
          messageId: interaction.message.interaction?.id
        })
        .select('query')
        .first()
    : undefined

  const activeQuery = paginatedMessage
    ? (JSON.parse(paginatedMessage.query as string) as PaginatedMessageQuery)
    : query ?? {}

  const pages = extractPages(
    isUpdatingMessage ? interaction.message.embeds[0].footer?.text : undefined
  )

  const currentPage = setCurrentPage(
    action,
    pages.currentPage,
    pages.totalPages
  )
  const offset = (currentPage - 1) * (limit ?? PAGINATION_LIMIT)

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
  components?: ActionRowBuilder<ButtonBuilder>[]
  query: PaginatedMessageQuery
  currentPage: number
  totalAmount: number
  limit?: number
}

export const sendPaginatedMessage = async ({
  customId,
  interaction,
  embed,
  components,
  currentPage,
  totalAmount,
  query,
  limit
}: SendPaginatedMessage) => {
  let totalPages = Math.ceil(totalAmount / (limit ?? PAGINATION_LIMIT))
  if (totalPages === 0) totalPages = 1

  log.info(
    `Obtained ${totalAmount} ${customId}. Showing page ${currentPage} of ${totalPages}`,
    interaction
  )

  embed
    .setColor(0xff_92_00)
    .setFooter({
      text: `Page ${currentPage} of ${totalPages}. ${providedBy}`
    })
    .setTimestamp()

  const pagination = paginatedButtons(
    interaction,
    customId,
    currentPage,
    totalPages
  )

  const isUpdatingMessage = interaction.isMessageComponent()
  const messageContent = {
    embeds: [embed],
    components: [
      ...(pagination ? [pagination] : []),
      ...(components && components?.length > 0 ? components : [])
    ]
  }

  if (isUpdatingMessage) {
    log.info(
      `Updating message ${interaction.message.interaction?.id}`,
      interaction
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
    log.info(`Sending new message`, interaction)
    const response = await interaction.editReply(messageContent)
    await database<PaginatedMessage>('paginated_messages').insert({
      messageId: response.interaction?.id,
      query: JSON.stringify(query)
    })
  }
}

import { ButtonInteraction, CommandInteraction, EmbedBuilder } from 'discord.js'
import { PaginatedButtonAction } from 'src/button.js'

import {
  PaginatedMessage,
  PaginatedMessageQuery
} from '../../models/database/paginatedMessage.js'
import { database } from '../../services/database.js'
import { getLevels } from '../../services/levels.js'
import { extractPages, log, providedBy } from '../../utils/index.js'
import { listLevels } from '../lists/listLevels.js'
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

interface PaginatedProperties {
  interaction: CommandInteraction | ButtonInteraction
  action: PaginatedButtonAction
  query?: PaginatedMessageQuery
  limit?: number
}

export const paginatedLevels = async (properties: PaginatedProperties) => {
  const { interaction, action, query, limit = 10 } = properties

  const isUpdate = interaction.isMessageComponent()
  const messageData = isUpdate
    ? await database<PaginatedMessage>('paginated_messages')
        .where({
          messageId: interaction.message.interaction?.id
        })
        .select('query')
    : undefined

  const activeQuery = messageData
    ? (JSON.parse(messageData[0].query as string) as PaginatedMessageQuery)
    : query ?? {}

  let { totalPages, currentPage } = extractPages(
    isUpdate ? interaction.message.embeds[0].footer?.text : undefined
  )

  currentPage = setCurrentPage(action, currentPage, totalPages)
  const offset = (currentPage - 1) * limit

  const { levels, totalAmount } = await getLevels({
    Id: activeQuery.id,
    WorkshopId: activeQuery.workshopId,
    Author: activeQuery.author,
    Name: activeQuery.name,
    Limit: 10,
    Offset: offset
  })

  totalPages = Math.ceil(totalAmount / limit)

  log.info(
    interaction,
    `Obtained ${totalAmount} levels. Showing page ${currentPage} of ${totalPages}`
  )

  const foundLevels = listLevels({
    levels: levels,
    offset,
    showRank: true
  })

  const embed = new EmbedBuilder()
    .setColor(0xff_92_00)
    .setTitle('Level Search Results')
    .setDescription(foundLevels ?? 'No levels found')
    .setFooter({
      text: `Page ${currentPage} of ${totalPages}. ${providedBy}`
    })
    .setTimestamp()

  const pagination = paginationButtons(
    interaction,
    'levels',
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

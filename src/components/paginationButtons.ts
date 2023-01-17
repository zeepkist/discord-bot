import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction
} from 'discord.js'

import { CollectorFilterValue } from '../models/collector.js'

export const paginationButtons = (
  interaction: CommandInteraction | ButtonInteraction,
  customIdPrefix: string,
  page: number,
  maxPages: number
) => {
  if (maxPages === 1) return

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder()
      .setCustomId(`${customIdPrefix}FirstButton`)
      .setLabel('First')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(`${customIdPrefix}PreviousButton`)
      .setLabel('Previous')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(`${customIdPrefix}NextButton`)
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === maxPages),
    new ButtonBuilder()
      .setCustomId(`${customIdPrefix}LastButton`)
      .setLabel('Last')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === maxPages)
  ])

  const collector = interaction.channel?.createMessageComponentCollector({
    filter: (m: CollectorFilterValue) =>
      ['first', 'previous', 'next', 'last'].includes(m.customId),
    time: 5 * 1000 * 60 // 5 minutes
  })

  collector?.on('end', () => {
    buttons.components[0].setDisabled(true)
    buttons.components[1].setDisabled(true)
    buttons.components[2].setDisabled(true)
    buttons.components[3].setDisabled(true)
    interaction.editReply({ components: [buttons] })
  })

  return buttons
}

import {
  ActionRowBuilder,
  bold,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  hyperlink,
  inlineCode,
  italic
} from 'discord.js'

import { getRecentRecords } from '../services/records.js'
import { formatRelativeDate } from '../utils/formatRelativeDate.js'
import { formatResultTime } from '../utils/formatResultTime.js'

export const recentPrevious = {
  name: 'recentPreviousButton',
  run: async (interaction: ButtonInteraction): Promise<void> => {
    const pages = interaction.message.embeds[0].footer?.text
      ?.split('Page ')[1]
      .split('. Data')[0]
    const [currentPage, totalPages] = pages?.split(' of ') as string[]

    console.log(currentPage, totalPages)
    const offset = (Number.parseInt(currentPage) - 2) * 10
    const cutoff = (Number.parseInt(currentPage) - 1) * 10

    const recentRecords = await getRecentRecords()
    const bestAndWrRecords = recentRecords.records.filter(record => {
      return record.isBest || record.isWorldRecord
    })

    console.log('[recent]:', 'obtained recent records', bestAndWrRecords.length)

    const recentRecordsList = bestAndWrRecords
      .slice(offset, cutoff)
      .map((record, index) => {
        const recordNumber = bold(`${index + 1}.`)
        const recordTime = inlineCode(formatResultTime(record.time))
        const recordUser = hyperlink(
          record.user.steamName,
          `https://zeepkist.wopian.me/user/${record.user.steamId}`
        )
        const recordLevel = `${italic(
          hyperlink(
            record.level.name,
            `https://zeepkist.wopian.me/level/${record.level.id}`
          )
        )} by ${record.level.author}`
        const recordWR = record.isWorldRecord ? ' (WR)' : ''
        const recordDate = formatRelativeDate(record.dateCreated)
        return `${recordNumber} ${recordUser} got ${recordTime}${recordWR} on ${recordLevel} (${recordDate})`
      })
      .join('\n')

    const embed = new EmbedBuilder()
      .setColor(0xff_92_00)
      .setTitle(`Recent Personal Bests`)
      .setDescription(recentRecordsList)
      .setFooter({
        text: `Page ${Number.parseInt(currentPage) - 1} of ${Math.ceil(
          bestAndWrRecords.length / 10
        )}. Data provided by Zeepkist GTR`
      })
      .setTimestamp()

    const paginationButtons =
      new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
          .setCustomId('recentFirstButton')
          .setLabel('First')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('recentPreviousButton')
          .setLabel('Previous')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('recentNextButton')
          .setLabel('Next')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('recentLastButton')
          .setLabel('Last')
          .setStyle(ButtonStyle.Primary)
      ])

    if (Number.parseInt(currentPage) - 1 === 1) {
      paginationButtons.components[0].setDisabled(true)
      paginationButtons.components[1].setDisabled(true)
    }

    if (Number.parseInt(currentPage) - 1 === Number.parseInt(totalPages)) {
      paginationButtons.components[2].setDisabled(true)
      paginationButtons.components[3].setDisabled(true)
    }

    interaction.update({ embeds: [embed], components: [paginationButtons] })
    console.log('recentNextButton')
  }
}

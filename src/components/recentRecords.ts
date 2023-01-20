import { ButtonInteraction, CommandInteraction, EmbedBuilder } from 'discord.js'

import { getRecentRecords } from '../services/records.js'
import { providedBy } from '../utils/index.js'
import { listRecords } from './lists/listRecords.js'
import { paginationButtons } from './paginationButtons.js'

export const recentRecords = async (
  interaction: CommandInteraction | ButtonInteraction,
  page = 1,
  limit = 10
) => {
  const records = await getRecentRecords()
  const filteredRecords = records.records.filter(
    record => record.isBest || record.isWorldRecord
  )

  const totalPages = Math.ceil(filteredRecords.length / limit)
  const offset = (page - 1) * limit
  const cutoff = page * limit

  console.log(
    `[recent]: Obtained ${filteredRecords.length} recent records. ${page}/${totalPages} pages.`
  )

  const recentRecords = listRecords({
    records: filteredRecords.slice(offset, cutoff),
    offset,
    showRank: true,
    showUser: true,
    showLevel: true,
    showMedal: true
  })

  const embed = new EmbedBuilder()
    .setColor(0xff_92_00)
    .setTitle(`Recent Personal Bests`)
    .setDescription(recentRecords ?? 'No recent records.')
    .setFooter({
      text: `Page ${page} of ${totalPages}. ${providedBy}`
    })
    .setTimestamp()

  const pagination = paginationButtons(interaction, 'recent', page, totalPages)

  return {
    embeds: [embed],
    components: pagination ? [pagination] : []
  }
}

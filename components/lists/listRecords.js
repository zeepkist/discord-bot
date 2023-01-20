import { inlineCode } from 'discord.js'

import {
  bestMedal,
  formatLevel,
  formatRank,
  formatRelativeDate,
  formatResultTime,
  formatUser
} from '../../utils/index.js'

export const listRecords = ({
  records,
  offset = 0,
  showRank = false,
  showUser = false,
  showLevel = false,
  showMedal = false
}) =>
  records
    .map((record, index) => {
      const rank = showRank ? formatRank(index + 1 + offset) : ''
      const time = inlineCode(formatResultTime(record.time))
      const user = showUser ? formatUser(record.user) : ''
      const level = showLevel ? `— ${formatLevel(record.level)}` : ''
      const date = `(${formatRelativeDate(record.dateCreated)})`
      const medal = showMedal ? bestMedal(record) : ''
      return `${rank} ${medal} ${time} ${user} ${level} ${date}`.replaceAll(
        '  ',
        ' '
      )
    })
    .join('\n')
export const listLevels = ({
  levels,
  offset = 0,
  showRank = false,
  showId = false
}) =>
  levels
    .map((level, index) => {
      const rank = showRank ? formatRank(index + 1 + offset) : ''
      const name = formatLevel(level)
      const id = showId ? `(${level.id})` : ''
      return `${rank} ${name} ${id}`.replaceAll('  ', ' ')
    })
    .join('\n')

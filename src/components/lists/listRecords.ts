import { inlineCode } from 'discord.js'

import { LevelRecord } from '../../models/record.js'
import {
  bestMedal,
  formatLevel,
  formatRank,
  formatRelativeDate,
  formatResultTime,
  formatUser
} from '../../utils/index.js'

interface RecordProperties {
  records: LevelRecord[]
  offset?: number
  showRank?: boolean
  showUser?: boolean
  showLevel?: boolean
  showMedal?: boolean
}

export const listRecords = ({
  records,
  offset = 0,
  showRank = false,
  showUser = false,
  showLevel = false,
  showMedal = false
}: RecordProperties): string =>
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

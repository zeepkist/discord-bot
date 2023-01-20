import { bold, hyperlink, inlineCode, italic } from 'discord.js'

import { Level } from '../../models/level.js'
import { LevelRecord } from '../../models/record.js'
import {
  bestMedal,
  formatRelativeDate,
  formatResultTime,
  numberToMonospace
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
      const rank = showRank
        ? bold(`${numberToMonospace(index + 1 + offset)}`.padEnd(3, ' '))
        : ''
      const time = inlineCode(formatResultTime(record.time))
      const user = showUser
        ? hyperlink(
            record.user.steamName,
            `https://zeepkist.wopian.me/user/${record.user.steamId}`
          )
        : ''
      const level = showLevel
        ? `— ${hyperlink(
            record.level.name,
            `https://zeepkist.wopian.me/level/${record.level.id}`
          )} by ${italic(record.level.author)}`
        : ''
      const date = `(${formatRelativeDate(record.dateCreated)})`
      const medal = showMedal ? bestMedal(record) : ''

      return `${rank} ${medal} ${time} ${user} ${level} ${date}`.replaceAll(
        '  ',
        ' '
      )
    })
    .join('\n')

interface LevelProperties {
  levels: Level[]
  offset?: number
  showRank?: boolean
  showId?: boolean
}

export const listLevels = ({
  levels,
  offset = 0,
  showRank = false,
  showId = false
}: LevelProperties): string =>
  levels
    .map((level, index) => {
      const rank = showRank ? bold(`${index + 1 + offset}`) : ''
      const name = `${hyperlink(
        level.name,
        `https://zeepkist.wopian.me/level/${level.id}`
      )} by ${italic(level.author)}`
      const id = showId ? `(${level.id})` : ''

      return `${rank} ${name} ${id}`.replaceAll('  ', ' ')
    })
    .join('\n')

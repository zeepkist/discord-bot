import { Level } from '../../models/level.js'
import { formatLevel, formatRank } from '../../utils/index.js'

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
      const rank = showRank ? formatRank(index + 1 + offset) : ''
      const name = formatLevel(level)
      const id = showId ? `(${level.id})` : ''

      return `${rank} ${name} ${id}`.replaceAll('  ', ' ')
    })
    .join('\n')

import { Level } from '@zeepkist/graphql/zworpshop'

import { MEDAL } from './medal.js'

export const bestMedal = (
  time: number,
  level: Level,
  isWorldRecord?: boolean
) => {
  if (isWorldRecord) return MEDAL.WR
  else if (time < level.validation) return MEDAL.AUTHOR
  else if (time < level.gold) return MEDAL.GOLD
  else if (time < level.silver) return MEDAL.SILVER
  else if (time < level.bronze) return MEDAL.BRONZE
  else return MEDAL.NONE
}

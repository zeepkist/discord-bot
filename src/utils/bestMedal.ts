import { config } from 'dotenv'

import { LevelRecord } from '../models/record.js'

config()

const IS_CANARY = process.env.CANARY

export const bestMedal = (record: LevelRecord) => {
  if (record.isWorldRecord) return '<:wr:1065822034090799135>'
  else if (record.time < record.level.timeAuthor)
    return IS_CANARY
      ? '<:author:1065842677020626944>'
      : '<:zeepkist_author:1008786679173234688> '
  else if (record.time < record.level.timeGold)
    return IS_CANARY
      ? '<:gold:1065842710365351947>'
      : '<:zeepkist_gold:1008786743706783826> '
  else if (record.time < record.level.timeSilver)
    return IS_CANARY
      ? '<:silver:1065842724433051748>'
      : '<:zeepkist_silver:1008786769380130959> '
  else if (record.time < record.level.timeBronze)
    return IS_CANARY
      ? '<:bronze:1065842732259606578>'
      : '<:zeepkist_bronze:1008786713688166400> '
  else return '<:blank:1065818232734351390>'
}

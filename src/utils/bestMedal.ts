import { LevelRecord } from '../models/record.js'

export const bestMedal = (record: LevelRecord) => {
  if (record.isWorldRecord) return '<:wr:1065822034090799135>'
  else if (record.time < record.level.timeAuthor)
    return '<:zeepkist_author:1008786679173234688> '
  else if (record.time < record.level.timeGold)
    return '<:zeepkist_gold:1008786743706783826> '
  else if (record.time < record.level.timeSilver)
    return '<:zeepkist_silver:1008786769380130959> '
  else if (record.time < record.level.timeBronze)
    return '<:zeepkist_bronze:1008786713688166400> '
  else return '<:blank:1065818232734351390>'
}

import { IS_PRODUCTION } from '../config/index.js'

export const MEDAL = {
  WR: '<:wr:1065822034090799135>',
  AUTHOR: IS_PRODUCTION
    ? '<:zeepkist_author:1008786679173234688>'
    : '<:author:1065842677020626944>',
  GOLD: IS_PRODUCTION
    ? '<:zeepkist_gold:1008786743706783826>'
    : '<:gold:1065842710365351947>',
  SILVER: IS_PRODUCTION
    ? '<:zeepkist_silver:1008786769380130959>'
    : '<:silver:1065842724433051748>',
  BRONZE: IS_PRODUCTION
    ? '<:zeepkist_bronze:1008786713688166400>'
    : '<:bronze:1065842732259606578>',
  NONE: '<:blank:1065818232734351390>'
}

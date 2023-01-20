import { config } from 'dotenv'

config()

const IS_CANARY = process.env.CANARY

export const MEDAL = {
  WR: '<:wr:1065822034090799135>',
  AUTHOR: IS_CANARY
    ? '<:author:1065842677020626944>'
    : '<:zeepkist_author:1008786679173234688>',
  GOLD: IS_CANARY
    ? '<:gold:1065842710365351947>'
    : '<:zeepkist_gold:1008786743706783826>',
  SILVER: IS_CANARY
    ? '<:silver:1065842724433051748>'
    : '<:zeepkist_silver:1008786769380130959>',
  BRONZE: IS_CANARY
    ? '<:bronze:1065842732259606578>'
    : '<:zeepkist_bronze:1008786713688166400>',
  NONE: '<:blank:1065818232734351390>'
}

import { User } from '@zeepkist/graphql/gtr'
import { Level } from '@zeepkist/graphql/zworpshop'
import { formatDistanceToNowStrict } from 'date-fns'
import { bold, hyperlink, inlineCode, italic } from 'discord.js'

import { ZEEPKIST_URL } from '../config/index.js'
import { DiscordDateEnum } from '../enums/index.js'
import { numberToMonospace } from './index.js'

export const formatRank = (rank: number): string =>
  bold(`${numberToMonospace(rank)})`.padStart(4, ' '))

export const formatLevel = (level: Level): string =>
  `${hyperlink(level.name, `${ZEEPKIST_URL}/level/${level.id}`)} by ${italic(
    level.fileAuthor
  )}`

export const formatUser = (
  user: Pick<User, 'steamName' | 'steamId'>
): string => {
  if (!user.steamName) return bold('Unknown')

  return hyperlink(user.steamName, `${ZEEPKIST_URL}/user/${user.steamId}`)
}

export const formatRelativeDate = (date: string) => {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true
  })
    .replaceAll('second', 'sec')
    .replaceAll('minute', 'min')
}

export const formatDiscordDate = (
  date: string,
  type: DiscordDateEnum = DiscordDateEnum.Relative
) => {
  const timestamp = new Date(date).getTime()

  return `<t:${Math.floor(timestamp / 1000)}:${type}>`
}

const pad = (number: number, size: number) =>
  ('00000' + number).slice(size * -1)

export const formatResultTime = (input: number, precision = 4) => {
  const time = Number.parseFloat(input.toFixed(precision))
  const hours = Math.floor(time / 60 / 60)
  const minutes = Math.floor(time / 60) % 60
  const seconds = Math.floor(time - minutes * 60)
  const milliseconds = Number.parseInt(input.toFixed(precision).split('.')[1])

  let string = ''
  if (hours) string += `${pad(hours, 2)}:`

  const result = (string += `${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(
    milliseconds,
    precision
  )}`)

  return inlineCode(result)
}

export const formatOrdinal = (number: number) => {
  const ordinals = ['th', 'st', 'nd', 'rd']
  const modulo = number % 100
  return (
    number + (ordinals[(modulo - 20) % 10] || ordinals[modulo] || ordinals[0])
  )
}

import { formatDistanceToNowStrict } from 'date-fns'
import { bold, hyperlink, italic } from 'discord.js'

import { Level } from '../models/level.js'
import { User } from '../models/user.js'
import { numberToMonospace } from './index.js'

export const formatRank = (rank: number): string =>
  bold(`${numberToMonospace(rank)}`.padStart(3, ' '))

export const formatLevel = (level: Level): string =>
  `${hyperlink(
    level.name,
    `https://zeepkist.wopian.me/level/${level.id}`
  )} by ${italic(level.author)}`

export const formatUser = (user: User): string =>
  hyperlink(user.steamName, `https://zeepkist.wopian.me/user/${user.steamId}`)

export const formatRelativeDate = (date: string) => {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true
  })
    .replaceAll('second', 'sec')
    .replaceAll('minute', 'min')
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
  return (string += `${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(
    milliseconds,
    precision
  )}`)
}

export const formatOrdinal = (number: number) => {
  const ordinals = ['th', 'st', 'nd', 'rd']
  const modulo = number % 100
  return (
    number + (ordinals[(modulo - 20) % 10] || ordinals[modulo] || ordinals[0])
  )
}

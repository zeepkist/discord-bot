import test from 'ava'

import { LevelRecord } from '../models/record.js'
import { bestMedal } from './index.js'

const macro = test.macro((t, input: LevelRecord, expected: string) =>
  t.is(bestMedal(input), expected)
)

const level = {
  id: 1,
  uniqueId: '1',
  workshopId: '1',
  name: 'Test Level',
  author: 'Test User',
  timeAuthor: 30.4532,
  timeGold: 30.6,
  timeSilver: 32,
  timeBronze: 36,
  thumbnailUrl: ''
}

const createLevelRecord = (
  time: number,
  isWorldRecord = false
): LevelRecord => ({
  id: 1,
  dateCreated: '2021-01-01T00:00:00.000Z',
  time,
  splits: [] as number[],
  ghostUrl: '',
  screenshotUrl: '',
  isBest: false,
  isValid: true,
  isWorldRecord,
  gameVersion: '',
  user: { id: 1, steamId: '1', steamName: 'Test User' },
  level
})

test(
  'displays world record medal',
  macro,
  createLevelRecord(30.4, true),
  '<:wr:1065822034090799135>'
)

test(
  'displays author medal',
  macro,
  createLevelRecord(30.4),
  '<:author:1065842677020626944>'
)

test(
  'displays gold medal',
  macro,
  createLevelRecord(30.5),
  '<:gold:1065842710365351947>'
)

test(
  'displays silver medal',
  macro,
  createLevelRecord(31),
  '<:silver:1065842724433051748>'
)

test(
  'displays bronze medal',
  macro,
  createLevelRecord(33),
  '<:bronze:1065842732259606578>'
)

test(
  'displays no medal',
  macro,
  createLevelRecord(38),
  '<:blank:1065818232734351390>'
)

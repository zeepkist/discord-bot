import { Level } from '@zeepkist/graphql/zworpshop'
import test from 'ava'

import { bestMedal } from './index.js'

interface MacroOptions {
  time: number
  level: Level
  isWorldRecord?: boolean
}

const macro = test.macro(
  (t, { time, level, isWorldRecord }: MacroOptions, expected: string) =>
    t.is(bestMedal(time, level, isWorldRecord), expected)
)

const level: Level = {
  id: 1,
  workshopId: '1',
  name: 'Test Level',
  nodeId: '1',
  imageUrl: '',
  createdAt: '2021-01-01T00:00:00.000Z',
  updatedAt: '2021-01-01T00:00:00.000Z',
  metadataId: 1,
  metadatumByMetadataId: {
    id: 1,
    nodeId: '1',
    hash: '',
    checkpoints: 1,
    blocks: '',
    ground: 0,
    skybox: 0,
    valid: true,
    validation: 30,
    gold: 32,
    silver: 34,
    bronze: 36,
    levelsByMetadataId: {} as never,
    __typename: 'Metadatum'
  },
  authorId: 1,
  fileHash: '',
  fileUrl: '',
  fileAuthor: '',
  fileUid: '',
  // eslint-disable-next-line unicorn/no-null
  replacedBy: null,
  deleted: false,
  __typename: 'Level'
}

test(
  'displays world record medal',
  macro,
  { time: 30.5, level, isWorldRecord: true },
  '<:wr:1065822034090799135>'
)

test(
  'displays author medal',
  macro,
  { time: 29.5, level },
  '<:author:1065842677020626944>'
)

test(
  'displays gold medal',
  macro,
  { time: 31, level },
  '<:gold:1065842710365351947>'
)

test(
  'displays silver medal',
  macro,
  { time: 33, level },
  '<:silver:1065842724433051748>'
)

test(
  'displays bronze medal',
  macro,
  { time: 35, level },
  '<:bronze:1065842732259606578>'
)

test(
  'displays no medal',
  macro,
  { time: 38, level },
  '<:blank:1065818232734351390>'
)

import { User } from '@zeepkist/graphql/gtr'
import { Level } from '@zeepkist/graphql/zworpshop'
import test from 'ava'

import { formatLevel, formatOrdinal, formatRank, formatUser } from './index.js'

const macro = test.macro((t, input: string, expected: string) =>
  t.is(input, expected)
)

// formatRank

test('displays rank 1', macro, formatRank(1), '** 𝟷)**')
test('displays rank 10', macro, formatRank(2), '** 𝟸)**')
test('displays rank 100', macro, formatRank(100), '**𝟷𝟶𝟶)**')
test('displays rank 1000', macro, formatRank(1000), '**𝟷𝟶𝟶𝟶)**')

// formatLevel

const level: Level = {
  id: 1,
  workshopId: '1',
  name: 'Level 1',
  nodeId: '1',
  imageUrl: '',
  createdAt: '2021-01-01T00:00:00.000Z',
  updatedAt: '2021-01-01T00:00:00.000Z',
  valid: true,
  validation: 30,
  gold: 32,
  silver: 34,
  bronze: 36,
  authorId: 1,
  fileHash: '',
  fileUrl: '',
  fileAuthor: 'Author Name',
  fileUid: '',
  // eslint-disable-next-line unicorn/no-null
  replacedBy: null,
  deleted: false,
  __typename: 'Level'
}

test(
  'displays level link',
  macro,
  formatLevel(level),
  '[Level 1](https://zeepki.st/level/1) by _Author Name_'
)

// formatUser

const user: Pick<User, 'id' | 'steamId' | 'steamName'> = {
  id: 1,
  steamId: '2',
  steamName: 'User Name'
}

test(
  'displays user link',
  macro,
  formatUser(user),
  '[User Name](https://zeepki.st/user/2)'
)

// formatOrdinal

test('displays ordinal 1', macro, formatOrdinal(1), '1st')
test('displays ordinal 2', macro, formatOrdinal(2), '2nd')
test('displays ordinal 3', macro, formatOrdinal(3), '3rd')
test('displays ordinal 4', macro, formatOrdinal(4), '4th')

test('displays ordinal 11', macro, formatOrdinal(11), '11th')
test('displays ordinal 12', macro, formatOrdinal(12), '12th')
test('displays ordinal 13', macro, formatOrdinal(13), '13th')
test('displays ordinal 21', macro, formatOrdinal(21), '21st')
test('displays ordinal 22', macro, formatOrdinal(22), '22nd')
test('displays ordinal 23', macro, formatOrdinal(23), '23rd')

test('displays ordinal 101', macro, formatOrdinal(101), '101st')
test('displays ordinal 102', macro, formatOrdinal(102), '102nd')
test('displays ordinal 103', macro, formatOrdinal(103), '103rd')
test('displays ordinal 111', macro, formatOrdinal(111), '111th')
test('displays ordinal 112', macro, formatOrdinal(112), '112th')
test('displays ordinal 113', macro, formatOrdinal(113), '113th')
test('displays ordinal 121', macro, formatOrdinal(121), '121st')
test('displays ordinal 122', macro, formatOrdinal(122), '122nd')
test('displays ordinal 123', macro, formatOrdinal(123), '123rd')

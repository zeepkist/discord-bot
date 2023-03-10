import test from 'ava'

import { Level } from '../models/level.js'
import { User } from '../models/user.js'
import {
  formatFlagEmoji,
  formatLevel,
  formatOrdinal,
  formatRank,
  formatUser
} from './index.js'

const macro = test.macro((t, input: string, expected: string) =>
  t.is(input, expected)
)

// formatRank

test('displays rank 1', macro, formatRank(1), '**βπ·**')
test('displays rank 10', macro, formatRank(2), '**βπΈ**')
test('displays rank 100', macro, formatRank(100), '**π·πΆπΆ**')
test('displays rank 1000', macro, formatRank(1000), '**π·πΆπΆπΆ**')

// formatLevel

const level: Level = {
  id: 1,
  uniqueId: '1',
  workshopId: '1',
  name: 'Level 1',
  author: 'Author Name',
  timeAuthor: 30.4532,
  timeGold: 30.6,
  timeSilver: 32,
  timeBronze: 36,
  thumbnailUrl: ''
}
test(
  'displays level link',
  macro,
  formatLevel(level),
  '[Level 1](https://zeepkist.wopian.me/level/1) by _Author Name_'
)

// formatUser

const user: User = {
  id: 1,
  steamId: '2',
  steamName: 'User Name'
}
test(
  'displays user link',
  macro,
  formatUser(user),
  '[User Name](https://zeepkist.wopian.me/user/2)'
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

// formatFlagEmoji

test('displays GB flag emoji', macro, formatFlagEmoji('gb'), 'π¬π§')
test('displays US flag emoji', macro, formatFlagEmoji('us'), 'πΊπΈ')
test('displays DE flag emoji', macro, formatFlagEmoji('de'), 'π©πͺ')
test('displays FR flag emoji', macro, formatFlagEmoji('fr'), 'π«π·')
test('displays ES flag emoji', macro, formatFlagEmoji('es'), 'πͺπΈ')
test('displays IT flag emoji', macro, formatFlagEmoji('it'), 'π?πΉ')
test('displays NL flag emoji', macro, formatFlagEmoji('nl'), 'π³π±')
test('displays RU flag emoji', macro, formatFlagEmoji('ru'), 'π·πΊ')
test('displays CN flag emoji', macro, formatFlagEmoji('cn'), 'π¨π³')
test('displays KR flag emoji', macro, formatFlagEmoji('kr'), 'π°π·')
test('displays JP flag emoji', macro, formatFlagEmoji('jp'), 'π―π΅')
test('displays BR flag emoji', macro, formatFlagEmoji('br'), 'π§π·')
test('displays AU flag emoji', macro, formatFlagEmoji('au'), 'π¦πΊ')
test('displays PL flag emoji', macro, formatFlagEmoji('pl'), 'π΅π±')
test('displays TR flag emoji', macro, formatFlagEmoji('tr'), 'πΉπ·')
test('displays CZ flag emoji', macro, formatFlagEmoji('cz'), 'π¨πΏ')
test('displays SE flag emoji', macro, formatFlagEmoji('se'), 'πΈπͺ')
test('displays DK flag emoji', macro, formatFlagEmoji('dk'), 'π©π°')
test('displays NO flag emoji', macro, formatFlagEmoji('no'), 'π³π΄')

import test from 'ava'

import { MEDAL } from './index.js'

const macro = test.macro((t, input: string, expected: string) =>
  t.is(input, expected)
)

test('returns world record medal', macro, MEDAL.WR, '<:wr:1065822034090799135>')
test(
  'returns author medal',
  macro,
  MEDAL.AUTHOR,
  '<:author:1065842677020626944>'
)
test('returns gold medal', macro, MEDAL.GOLD, '<:gold:1065842710365351947>')
test(
  'returns silver medal',
  macro,
  MEDAL.SILVER,
  '<:silver:1065842724433051748>'
)
test(
  'returns bronze medal',
  macro,
  MEDAL.BRONZE,
  '<:bronze:1065842732259606578>'
)
test('returns no medal', macro, MEDAL.NONE, '<:blank:1065818232734351390>')

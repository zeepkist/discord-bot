import test from 'ava'

import { numberToMonospace } from './index.js'

const macro = test.macro((t, input: number, expected: string) =>
  t.is(numberToMonospace(input), expected)
)

test('displays 0', macro, 0, 'πΆ')
test('displays 1', macro, 1, 'π·')
test('displays 2', macro, 2, 'πΈ')
test('displays 3', macro, 3, 'πΉ')
test('displays 4', macro, 4, 'πΊ')
test('displays 5', macro, 5, 'π»')
test('displays 6', macro, 6, 'πΌ')
test('displays 7', macro, 7, 'π½')
test('displays 8', macro, 8, 'πΎ')
test('displays 9', macro, 9, 'πΏ')
test('displays 10', macro, 10, 'π·πΆ')
test('displays 23', macro, 23, 'πΈπΉ')
test('displays 100', macro, 100, 'π·πΆπΆ')
test('displays 456', macro, 456, 'πΊπ»πΌ')
test('displays 1000', macro, 1000, 'π·πΆπΆπΆ')
test('displays 7890', macro, 7890, 'π½πΎπΏπΆ')

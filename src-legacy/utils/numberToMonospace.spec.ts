import test from 'ava'

import { numberToMonospace } from './index.js'

const macro = test.macro((t, input: number, expected: string) =>
  t.is(numberToMonospace(input), expected)
)

test('displays 0', macro, 0, '𝟶')
test('displays 1', macro, 1, '𝟷')
test('displays 2', macro, 2, '𝟸')
test('displays 3', macro, 3, '𝟹')
test('displays 4', macro, 4, '𝟺')
test('displays 5', macro, 5, '𝟻')
test('displays 6', macro, 6, '𝟼')
test('displays 7', macro, 7, '𝟽')
test('displays 8', macro, 8, '𝟾')
test('displays 9', macro, 9, '𝟿')
test('displays 10', macro, 10, '𝟷𝟶')
test('displays 23', macro, 23, '𝟸𝟹')
test('displays 100', macro, 100, '𝟷𝟶𝟶')
test('displays 456', macro, 456, '𝟺𝟻𝟼')
test('displays 1000', macro, 1000, '𝟷𝟶𝟶𝟶')
test('displays 7890', macro, 7890, '𝟽𝟾𝟿𝟶')

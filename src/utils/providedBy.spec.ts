import test from 'ava'

import { LevelRecord } from '../models/record.js'
import { providedBy } from './index.js'

const macro = test.macro((t, expected: string) => t.is(providedBy, expected))

test('displays provided by', macro, 'Data provided by Zeepkist GTR')

import test from 'ava';
import { providedBy } from './index.js';
const macro = test.macro((t, expected) => t.is(providedBy, expected));
test('displays provided by', macro, 'Data provided by Zeepkist GTR');

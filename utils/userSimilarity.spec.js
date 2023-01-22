import test from 'ava';
import { userSimilarity } from './index.js';
const macro = test.macro((t, input, expected) => t.is(userSimilarity(input.discordName, input.steamNames), expected));
test('names are the same', macro, {
    discordName: 'Name',
    steamNames: ['Name']
}, 0);
test('names are very similar', macro, {
    discordName: 'Name',
    steamNames: ['A Name']
}, 2);
test('names are the same with clan tags stripped', macro, {
    discordName: 'Name',
    steamNames: ['[ABC] Name']
}, 0);
test('names are very similar with clan tags stripped', macro, {
    discordName: 'Name',
    steamNames: ['A Name']
}, 2);
test('names are very different', macro, {
    discordName: 'Name',
    steamNames: ['A Different Person']
}, 16);
test('one of the names is the same', macro, {
    discordName: 'Name',
    steamNames: ['Name', 'A Different Person']
}, 0);
test('one of the names is very similar', macro, {
    discordName: 'Name',
    steamNames: ['A Name', 'A Different Person']
}, 2);
test('none of the names are very similar', macro, {
    discordName: 'Name',
    steamNames: ['Hot Potatoes', 'A Different Person']
}, 10);

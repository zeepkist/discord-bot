import test from 'ava';
import { extractPages } from './index.js';
const macro = test.macro((t, input, expected) => t.deepEqual(extractPages(input), expected));
test('extracts pages 0/0', macro, 'Page 0 of 0', {
    currentPage: 0,
    totalPages: 0
});
test('extracts pages 1/2', macro, 'Page 1 of 2', {
    currentPage: 1,
    totalPages: 2
});
test('extracts pages 2/2', macro, 'Page 2 of 2', {
    currentPage: 2,
    totalPages: 2
});
test('extracts pages 53/743', macro, 'Page 53 of 743', {
    currentPage: 53,
    totalPages: 743
});

import test from 'ava';
import { formatFlagEmoji, formatLevel, formatOrdinal, formatRank, formatUser } from './index.js';
const macro = test.macro((t, input, expected) => t.is(input, expected));
test('displays rank 1', macro, formatRank(1), '** 𝟷**');
test('displays rank 10', macro, formatRank(2), '** 𝟸**');
test('displays rank 100', macro, formatRank(100), '**𝟷𝟶𝟶**');
test('displays rank 1000', macro, formatRank(1000), '**𝟷𝟶𝟶𝟶**');
const level = {
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
};
test('displays level link', macro, formatLevel(level), '[Level 1](https://zeepkist.wopian.me/level/1) by _Author Name_');
const user = {
    id: 1,
    steamId: '2',
    steamName: 'User Name'
};
test('displays user link', macro, formatUser(user), '[User Name](https://zeepkist.wopian.me/user/2)');
test('displays ordinal 1', macro, formatOrdinal(1), '1st');
test('displays ordinal 2', macro, formatOrdinal(2), '2nd');
test('displays ordinal 3', macro, formatOrdinal(3), '3rd');
test('displays ordinal 4', macro, formatOrdinal(4), '4th');
test('displays ordinal 11', macro, formatOrdinal(11), '11th');
test('displays ordinal 12', macro, formatOrdinal(12), '12th');
test('displays ordinal 13', macro, formatOrdinal(13), '13th');
test('displays ordinal 21', macro, formatOrdinal(21), '21st');
test('displays ordinal 22', macro, formatOrdinal(22), '22nd');
test('displays ordinal 23', macro, formatOrdinal(23), '23rd');
test('displays ordinal 101', macro, formatOrdinal(101), '101st');
test('displays ordinal 102', macro, formatOrdinal(102), '102nd');
test('displays ordinal 103', macro, formatOrdinal(103), '103rd');
test('displays ordinal 111', macro, formatOrdinal(111), '111th');
test('displays ordinal 112', macro, formatOrdinal(112), '112th');
test('displays ordinal 113', macro, formatOrdinal(113), '113th');
test('displays ordinal 121', macro, formatOrdinal(121), '121st');
test('displays ordinal 122', macro, formatOrdinal(122), '122nd');
test('displays ordinal 123', macro, formatOrdinal(123), '123rd');
test('displays GB flag emoji', macro, formatFlagEmoji('gb'), '🇬🇧');
test('displays US flag emoji', macro, formatFlagEmoji('us'), '🇺🇸');
test('displays DE flag emoji', macro, formatFlagEmoji('de'), '🇩🇪');
test('displays FR flag emoji', macro, formatFlagEmoji('fr'), '🇫🇷');
test('displays ES flag emoji', macro, formatFlagEmoji('es'), '🇪🇸');
test('displays IT flag emoji', macro, formatFlagEmoji('it'), '🇮🇹');
test('displays NL flag emoji', macro, formatFlagEmoji('nl'), '🇳🇱');
test('displays RU flag emoji', macro, formatFlagEmoji('ru'), '🇷🇺');
test('displays CN flag emoji', macro, formatFlagEmoji('cn'), '🇨🇳');
test('displays KR flag emoji', macro, formatFlagEmoji('kr'), '🇰🇷');
test('displays JP flag emoji', macro, formatFlagEmoji('jp'), '🇯🇵');
test('displays BR flag emoji', macro, formatFlagEmoji('br'), '🇧🇷');
test('displays AU flag emoji', macro, formatFlagEmoji('au'), '🇦🇺');
test('displays PL flag emoji', macro, formatFlagEmoji('pl'), '🇵🇱');
test('displays TR flag emoji', macro, formatFlagEmoji('tr'), '🇹🇷');
test('displays CZ flag emoji', macro, formatFlagEmoji('cz'), '🇨🇿');
test('displays SE flag emoji', macro, formatFlagEmoji('se'), '🇸🇪');
test('displays DK flag emoji', macro, formatFlagEmoji('dk'), '🇩🇰');
test('displays NO flag emoji', macro, formatFlagEmoji('no'), '🇳🇴');

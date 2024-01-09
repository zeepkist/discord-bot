import { about } from '../commands/about.js';
import { leaderboard } from '../commands/leaderboard.js';
import { level } from '../commands/level.js';
import { random } from '../commands/random.js';
import { records } from '../commands/records.js';
import { user } from '../commands/user.js';
export const createCommands = () => [
    about,
    leaderboard,
    level,
    random,
    records,
    user
];

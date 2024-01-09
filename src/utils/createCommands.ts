import { about } from '../commands/about.js'
import { leaderboard } from '../commands/leaderboard.js'
import { level } from '../commands/level.js'
import { random } from '../commands/random.js'
import { records } from '../commands/records.js'
import { user } from '../commands/user.js'
import type { Command } from '../types/index.js'

export const createCommands = (): Command[] => [
  about,
  leaderboard,
  level,
  random,
  records,
  user
]

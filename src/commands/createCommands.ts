import type { Command } from '../types/index.js'
import { about } from './about.js'
import { leaderboard } from './leaderboard.js'
import { level } from './level.js'
import { random } from './random.js'
import { records } from './records.js'
import { user } from './user.js'
import { users } from './users.js'

export const createCommands = (): Command[] => [
  about,
  level,
  random,
  user,
  users,
  leaderboard,
  records
]

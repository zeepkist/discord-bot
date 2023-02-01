import { Command } from './command.js'
import { about } from './commands/about.js'
import { level } from './commands/level.js'
import { rankings } from './commands/rankings.js'
import { recent } from './commands/recent.js'
import { user } from './commands/user.js'
import { verify } from './commands/verify.js'

export const commands: Command[] = [
  about,
  level,
  rankings,
  recent,
  user,
  verify
]

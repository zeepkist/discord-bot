import { Command } from './command.js'
import { about } from './commands/about.js'
import { level } from './commands/level.js'
import { ranking } from './commands/ranking.js'
import { recent } from './commands/recent.js'
import { user } from './commands/user.js'
import { verify } from './commands/verify.js'

export const commands: Command[] = [about, level, ranking, recent, user, verify]

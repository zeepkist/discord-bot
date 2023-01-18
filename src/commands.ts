import { Command } from './command.js'
import { level } from './commands/level.js'
import { ranking } from './commands/ranking.js'
import { recent } from './commands/recent.js'
import { user } from './commands/user.js'
// import { verify } from './commands/verify.js'

export const commands: Command[] = [level, ranking, recent, user]

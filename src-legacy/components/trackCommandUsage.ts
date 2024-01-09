import { database } from '../services/database.js'

export const trackCommandUsage = async (commandName: string) => {
  const command = await database('command_usage')
    .select('commandName', 'invocations')
    .where({
      commandName
    })

  await (command.length === 0
    ? database('command_usage').insert({
        commandName,
        invocations: 1
      })
    : database('command_usage')
        .update({
          invocations: command[0].invocations + 1
        })
        .where({
          commandName
        }))
}

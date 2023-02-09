import { AxiosError } from 'axios'
import { CommandInteraction } from 'discord.js'

import { log } from '../utils/index.js'

export const errorReply = async (
  interaction: CommandInteraction,
  command: string,
  error: AxiosError | unknown
) => {
  log.error(
    `An error occured processing the "${command}" command.\n\n${String(error)}`
  )

  log.error(error as string)

  await interaction.reply({
    ephemeral: true,
    content:
      'An unexpected error occured while processing your request. Please try again later.'
  })
  setTimeout(() => interaction.deleteReply(), 15_000)
}

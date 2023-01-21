import { format } from 'date-fns'
import {
  ButtonInteraction,
  CommandInteraction,
  ModalSubmitInteraction
} from 'discord.js'

interface LogProperties {
  interaction: CommandInteraction | ButtonInteraction | ModalSubmitInteraction
}

const guildName = (interaction: LogProperties['interaction']) =>
  interaction.guild?.name || 'Unknown guild'

const interactionName = (interaction: LogProperties['interaction']) =>
  interaction instanceof CommandInteraction
    ? interaction.commandName
    : interaction.customId

const date = format(Date.now(), 'yyyy-MM-dd HH:mm:ss')

export const log = {
  info: (interaction: LogProperties['interaction'], message: string) => {
    const guild = guildName(interaction)
    const name = interactionName(interaction)
    console.log(`[${date}][${name}][${guild}]: ${message}`)
  },
  error: (interaction: LogProperties['interaction'], message: string) => {
    const guild = guildName(interaction)
    const name = interactionName(interaction)
    console.log(`[${date}][${name}][${guild}]: ${message}`)
  }
}

//import { format } from 'date-fns'
import {
  ButtonInteraction,
  CommandInteraction,
  ModalSubmitInteraction
} from 'discord.js'
import { createLogger, format, transports } from 'winston'

const logFormat = format.printf(({ level, message, label, timestamp }) => {
  return label
    ? `${timestamp} ${label} ${level}: ${message}`
    : `${timestamp} ${level}: ${message}`
})

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), logFormat),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
})

interface LogProperties {
  interaction: CommandInteraction | ButtonInteraction | ModalSubmitInteraction
}

const guildName = (interaction: LogProperties['interaction']) =>
  interaction.guild?.name || 'Unknown guild'

const interactionName = (interaction: LogProperties['interaction']) =>
  interaction instanceof CommandInteraction
    ? interaction.commandName
    : interaction.customId

export const log = {
  info: (message: string, interaction?: LogProperties['interaction']) => {
    if (interaction) {
      const guild = guildName(interaction)
      const name = interactionName(interaction)

      logger.info(message, {
        label: `[${name}] [${guild}]`
      })
    } else {
      logger.info(message)
    }
  },
  error: (message: string, interaction?: LogProperties['interaction']) => {
    if (interaction) {
      const guild = guildName(interaction)
      const name = interactionName(interaction)

      logger.error(message, {
        label: `[${name}] [${guild}]`
      })
    } else {
      logger.error(message)
    }
  }
}

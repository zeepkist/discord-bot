import {
  ButtonInteraction,
  CommandInteraction,
  ModalSubmitInteraction
} from 'discord.js'
import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const logFormat = format.printf(({ level, message, label, timestamp }) => {
  return label
    ? `${timestamp} ${level}: ${label} ${message}`
    : `${timestamp} ${level}: ${message}`
})

const rotatingTransport: DailyRotateFile = new DailyRotateFile({
  filename: '%DATE%.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD',
  handleExceptions: true,
  handleRejections: true,
  // zippedArchive: true,
  maxSize: '5m',
  maxFiles: '14d'
})

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), logFormat),
  transports: [
    rotatingTransport,
    new transports.File({
      filename: 'logs/error.log',
      handleExceptions: true,
      handleRejections: true,
      level: 'error'
    }),
    new transports.Console({
      handleExceptions: true,
      handleRejections: true,
      format: format.combine(format.colorize(), format.timestamp(), logFormat)
    })
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
        label: `[${guild}][${name}]`
      })
    } else {
      logger.info(message)
    }
  },
  warn: (message: string, interaction?: LogProperties['interaction']) => {
    if (interaction) {
      const guild = guildName(interaction)
      const name = interactionName(interaction)

      logger.warn(message, {
        label: `[${guild}][${name}]`
      })
    } else {
      logger.warn(message)
    }
  },
  error: (message: string, interaction?: LogProperties['interaction']) => {
    if (interaction) {
      const guild = guildName(interaction)
      const name = interactionName(interaction)

      logger.error(message, {
        label: `[${guild}][${name}]`
      })
    } else {
      logger.error(message)
    }
  }
}

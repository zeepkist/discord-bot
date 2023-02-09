import { CommandInteraction } from 'discord.js';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const logFormat = format.printf(({ level, message, label, timestamp }) => {
    return label
        ? `${timestamp} ${level}: ${label} ${message}`
        : `${timestamp} ${level}: ${message}`;
});
const rotatingTransport = new DailyRotateFile({
    filename: '%DATE%.log',
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD',
    maxSize: '5m',
    maxFiles: '14d'
});
const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), logFormat),
    transports: [
        rotatingTransport,
        new transports.File({
            filename: 'logs/error.log',
            handleExceptions: true,
            level: 'error'
        }),
        new transports.Console({
            handleExceptions: true,
            format: format.combine(format.colorize(), format.timestamp(), logFormat)
        })
    ]
});
const guildName = (interaction) => interaction.guild?.name || 'Unknown guild';
const interactionName = (interaction) => interaction instanceof CommandInteraction
    ? interaction.commandName
    : interaction.customId;
export const log = {
    info: (message, interaction) => {
        if (interaction) {
            const guild = guildName(interaction);
            const name = interactionName(interaction);
            logger.info(message, {
                label: `[${guild}][${name}]`
            });
        }
        else {
            logger.info(message);
        }
    },
    error: (message, interaction) => {
        if (interaction) {
            const guild = guildName(interaction);
            const name = interactionName(interaction);
            logger.error(message, {
                label: `[${guild}][${name}]`
            });
        }
        else {
            logger.error(message);
        }
    }
};

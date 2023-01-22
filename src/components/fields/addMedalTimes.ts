import {
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
  inlineCode
} from 'discord.js'

import { Level } from '../../models/level.js'
import { formatResultTime, log, MEDAL } from '../../utils/index.js'

interface MedalTimes {
  interaction: CommandInteraction | ButtonInteraction
  embed: EmbedBuilder
  level: Level
}

export const addMedalTimes = async ({
  interaction,
  embed,
  level
}: MedalTimes) => {
  log.info(interaction, `Adding medal times to ${level.id}`)
  const medalTimes = [
    level.timeAuthor &&
      `${MEDAL.AUTHOR} ${inlineCode(formatResultTime(level.timeAuthor))}`,
    level.timeGold &&
      `${MEDAL.GOLD} ${inlineCode(formatResultTime(level.timeGold))}`,
    level.timeSilver &&
      `${MEDAL.SILVER} ${inlineCode(formatResultTime(level.timeSilver))}`,
    level.timeBronze &&
      `${MEDAL.BRONZE} ${inlineCode(formatResultTime(level.timeBronze))}`
  ].join('\n')

  embed.addFields({
    name: 'Medal Times',
    value: medalTimes,
    inline: true
  })
}

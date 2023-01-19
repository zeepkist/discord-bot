import { bold, EmbedBuilder, hyperlink, inlineCode, italic } from 'discord.js'

import { providedBy } from '../utils/providedBy.js'

export const levelsList = async (interaction, levels, totalAmount) => {
  const list = levels
    .map((level, index) => {
      const levelNumber = bold(`${index + 1}.`)
      const levelName = hyperlink(
        level.name,
        `https://zeepkist.wopian.me/level/${level.id}`
      )
      const levelAuthor = italic(level.author)
      const levelId = `ID ${inlineCode(String(level.id))}`
      return `${levelNumber} ${levelName} by ${levelAuthor} (${levelId})`
    })
    .join('\n')
  let description = `Found ${bold(String(totalAmount))} levels:\n\n${list}`
  if (totalAmount > 10) {
    description += `\n\n${italic('Only the first 10 levels are shown.')}`
  }
  const embed = new EmbedBuilder()
    .setColor(0xff_92_00)
    .setTitle('Level Search Results')
    .setDescription(description)
    .setFooter({ text: providedBy })
  return { embeds: [embed] }
}

import { ButtonInteraction } from 'discord.js'

import { recentRecords } from '../components/recentRecords.js'
import { extractPages } from '../utils/index.js'

export const recentPrevious = {
  name: 'recentPreviousButton',
  run: async (interaction: ButtonInteraction): Promise<void> => {
    const { currentPage } = extractPages(
      interaction.message.embeds[0].footer?.text
    )
    const { embeds, components } = await recentRecords(
      interaction,
      currentPage - 1
    )

    interaction.update({ embeds, components })
  }
}

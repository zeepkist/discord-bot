import { ButtonInteraction } from 'discord.js'

import { userRankings } from '../components/userRankings.js'
import { extractPages } from '../utils/index.js'

export const rankingPrevious = {
  name: 'rankingPreviousButton',
  run: async (interaction: ButtonInteraction): Promise<void> => {
    const { currentPage } = extractPages(
      interaction.message.embeds[0].footer?.text
    )
    const { embeds, components } = await userRankings(
      interaction,
      currentPage - 1
    )

    interaction.update({ embeds, components })
  }
}
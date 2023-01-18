import { ButtonInteraction } from 'discord.js'

import { userRankings } from '../components/userRankings.js'
import { extractPages } from '../utils/index.js'

export const rankingNext = {
  name: 'rankingNextButton',
  run: async (interaction: ButtonInteraction): Promise<void> => {
    const { currentPage } = extractPages(
      interaction.message.embeds[0].footer?.text
    )
    const { embeds, components } = await userRankings(
      interaction,
      currentPage + 1
    )

    interaction.update({ embeds, components })
  }
}

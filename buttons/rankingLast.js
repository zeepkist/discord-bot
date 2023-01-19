import { userRankings } from '../components/userRankings.js'
import { extractPages } from '../utils/index.js'

export const rankingLast = {
  name: 'rankingLastButton',
  run: async interaction => {
    const { totalPages } = extractPages(
      interaction.message.embeds[0].footer?.text
    )
    const { embeds, components } = await userRankings(interaction, totalPages)
    interaction.update({ embeds, components })
  }
}

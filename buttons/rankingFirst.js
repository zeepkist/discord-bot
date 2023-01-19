import { userRankings } from '../components/userRankings.js'

export const rankingFirst = {
  name: 'rankingFirstButton',
  run: async interaction => {
    const { embeds, components } = await userRankings(interaction)
    interaction.update({ embeds, components })
  }
}

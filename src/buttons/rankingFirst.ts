import { ButtonInteraction } from 'discord.js'

import { userRankings } from '../components/userRankings.js'

export const rankingFirst = {
  name: 'rankingFirstButton',
  run: async (interaction: ButtonInteraction): Promise<void> => {
    const { embeds, components } = await userRankings(interaction)

    interaction.update({ embeds, components })
  }
}

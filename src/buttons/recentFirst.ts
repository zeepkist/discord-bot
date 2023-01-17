import { ButtonInteraction } from 'discord.js'

import { recentRecords } from '../components/recentRecords.js'

export const recentFirst = {
  name: 'recentFirstButton',
  run: async (interaction: ButtonInteraction): Promise<void> => {
    const { embeds, components } = await recentRecords(interaction)

    interaction.update({ embeds, components })
  }
}

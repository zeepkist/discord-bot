import {
  ApplicationCommandType,
  bold,
  EmbedBuilder,
  hyperlink
} from 'discord.js'

import { Command } from '../types/index.js'

export const about: Command = {
  name: 'about',
  description: 'Useful information and how to support development',
  type: ApplicationCommandType.ChatInput,
  ephemeral: false,
  run: async interaction => {
    const embed = new EmbedBuilder()
      .setTitle('About')
      .setColor(0xff_92_00)
      .setDescription(
        `This is a bot to show live user times and rankings for ${hyperlink(
          'Zeepkist',
          'https://store.steampowered.com/app/1440670'
        )}\n\nAll data is provided by the Zeepkist GTR API and the Steam API.\n\nThe bot is not affiliated with Steam and only uses the Steam API to get ${bold(
          'public'
        )} user information not provided by Zeepkist GTR. Data obtained from the Steam API is never stored by the bot.`
      )

    await interaction.editReply({
      embeds: [embed]
    })
  }
}

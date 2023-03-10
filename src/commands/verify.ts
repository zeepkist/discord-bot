import {
  ActionRowBuilder,
  ApplicationCommandType,
  bold,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  hyperlink
} from 'discord.js'

import { Command } from '../command.js'
import { alreadyLinkedReply } from '../components/accountAlreadyLinked.js'
import { CollectorFilterValue } from '../models/collector.js'
import { database } from '../services/database.js'

export const verify: Command = {
  name: 'verify',
  description: 'Link your Steam and Discord accounts',
  type: ApplicationCommandType.ChatInput,
  ephemeral: true,
  run: async interaction => {
    const linkedAccount = await database('linked_accounts').where({
      discordId: interaction.user.id
    })
    if (linkedAccount.length > 0) {
      alreadyLinkedReply(interaction)
      return
    }

    const embed = new EmbedBuilder()
      .setTitle('Link your Steam and Discord accounts')
      .setDescription(
        `${bold('1.')} Visit ${hyperlink(
          'https://thezeepkistpodium.com/verify',
          'https://thezeepkistpodium.com/verify'
        )}\n${bold(
          '2.'
        )} Login to Steam with OpenID (only your Steam ID is obtained)\n${bold(
          '3.'
        )} Submit the unique code generated by ${bold(
          'thezeepkistpodium.com'
        )} using the button below\n\nOnly your Steam ID and Discord ID is stored by the bot.`
      )
      .setColor(0x00_ff_00)
      .setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      new ButtonBuilder()
        .setLabel('Get Code')
        .setStyle(ButtonStyle.Link)
        .setURL('https://thezeepkistpodium.com/verify'),
      new ButtonBuilder()
        .setCustomId('submitTokenButton')
        .setLabel('Submit Code')
        .setStyle(ButtonStyle.Primary)
    ])

    const collector = interaction.channel?.createMessageComponentCollector({
      filter: (m: CollectorFilterValue) => m.customId === 'submitToken',
      time: 3 * 1000 * 60 // 3 minutes
    })

    collector?.on('end', () => {
      row.components[1].setDisabled(true)
      interaction.editReply({ components: [row] })
    })

    await interaction.editReply({
      embeds: [embed],
      components: [row]
    })
  }
}

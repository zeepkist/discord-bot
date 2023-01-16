import { Command } from "../command.js";
import { ApplicationCommandType, Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, bold, italic, inlineCode, hyperlink } from "discord.js";
import { getRecentRecords } from "../services/records.js";
import { formatResultTime } from "../utils/formatResultTime.js";
import { formatRelativeDate } from "../utils/formatRelativeDate.js";
import { AxiosError } from "axios";
import { isAfter } from "date-fns";

export const recent: Command = {
    name: "recent",
    description: "Get recent records",
    type: ApplicationCommandType.ChatInput,
    options: [],
    run: async (interaction: CommandInteraction) => {
      try {
        const recentRecords = await getRecentRecords({ Limit: 5 });
        const bestAndWrRecords = recentRecords.records.filter(record => {
          return record.isBest || record.isWorldRecord
        })

        console.log('[recent]:', 'obtained recent records', bestAndWrRecords)

        const recentRecordsList = bestAndWrRecords.slice(0, 10).map((record, index) => {
          const recordNumber = bold(`${index + 1}.`)
          const recordTime = inlineCode(formatResultTime(record.time))
          const recordUser = hyperlink(record.user.steamName, `https://zeepkist.wopian.me/user/${record.user.steamId}`)
          const recordLevel = `${italic(hyperlink(record.level.name, `https://zeepkist.wopian.me/level/${record.level.id}`))} by ${record.level.author}`
          const recordDate = formatRelativeDate(record.dateCreated)
          return `${recordNumber} ${recordUser} got ${recordTime} on ${recordLevel} (${recordDate})`
        }).join('\n')

        const embed = new EmbedBuilder()
          .setColor(0xff9200)
          .setTitle(`Recent Records`)
          .setDescription(recentRecordsList)
          .setFooter({
            text: `Page 1 of ${Math.ceil(bestAndWrRecords.length / 10)}. Data provided by Zeepkist GTR`
          })
          .setTimestamp()

        const paginationButtons = new ActionRowBuilder<ButtonBuilder>().addComponents([
          new ButtonBuilder()
            .setCustomId('first')
            .setLabel('First')
            .setStyle(ButtonStyle.Primary).setDisabled(true),
          new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary).setDisabled(true),
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary).setDisabled(true),
          new ButtonBuilder()
            .setCustomId('last')
            .setLabel('Last')
            .setStyle(ButtonStyle.Primary).setDisabled(true)
        ])

        interaction.reply({ embeds: [embed], components: [paginationButtons] });
      } catch (error: AxiosError | any) {
        console.error(String(error));
        await interaction.reply({
          ephemeral: true,
          content: 'An error occurred while fetching user data. Please try again later.'
        });
      }
    }
}

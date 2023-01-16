import { Command } from "../command.js";
import { ApplicationCommandType, Client, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, bold, italic, inlineCode, hyperlink, ApplicationCommandOptionType } from "discord.js";
import { getRecords } from "../services/records.js";
import { getLevels } from "../services/levels.js";
import { formatResultTime } from "../utils/formatResultTime.js";
import { formatRelativeDate } from "../utils/formatRelativeDate.js";
import { AxiosError } from "axios";

export const level: Command = {
  name: "level",
  description: "Get records for a level",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "id",
      description: "The id of the level",
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: "workshopid",
      description: "The workshop id of the level(s)",
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: "author",
      description: "The author of the level(s)",
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: "name",
      description: "The name of the level(s)",
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ],
  run: async (interaction: CommandInteraction) => {
    const id = interaction.options.data.find(option => option.name === 'id')?.value as number
    const workshopId = interaction.options.data.find(option => option.name === 'workshopid')?.value as string
    const author = interaction.options.data.find(option => option.name === 'author')?.value as string
    const name = interaction.options.data.find(option => option.name === 'name')?.value as string

    console.log('[level]:', id, workshopId, author, name)

    if (!id && !workshopId && !author && !name) {
      console.log('[level]:', 'No arguments provided')
      await interaction.reply({ content: 'You must provide either a level ID, workshop ID, author or name of a level.', ephemeral: true })
      return
    }

    try {
      const levels = await getLevels({ Id: id, WorkshopId: workshopId, Author: author, Name: name })

      if (levels.totalAmount === 0) {
        console.log('[level]:', 'No level found', levels)
        const embed = new EmbedBuilder()
          .setTitle('No level found')
          .setDescription('No level found with the provided arguments.')
          .setColor(0xff0000)
          .setTimestamp()

        await interaction.reply({ embeds: [embed], ephemeral: true })
        return
      }

      if (levels.totalAmount > 1) {
        console.log('[level]:', 'Found multiple levels', levels)
        await interaction.reply({ content: `${levels.totalAmount} levels` })
        return
      }

      if (levels.totalAmount === 1) {
        console.log('[level]:', 'Found 1 level', levels)

        const level = levels.levels[0]
        const records = await getRecords({ LevelId: level.id, BestOnly: true, Limit: 10 })

        const recordsList = records.records.slice(0, 10).map((record, index) => {
          const recordNumber = bold(`${index + 1}.`)
          const recordTime = inlineCode(formatResultTime(record.time))
          const recordUser = hyperlink(record.user.steamName, `https://zeepkist.wopian.me/user/${record.user.steamId}`)
          const recordLevel = `${italic(hyperlink(record.level.name, `https://zeepkist.wopian.me/level/${record.level.id}`))} by ${record.level.author}`
          const recordDate = formatRelativeDate(record.dateCreated)
          return `${recordNumber} ${recordUser} got ${recordTime} on ${recordLevel} (${recordDate})`
        }).join('\n')

        const embed = new EmbedBuilder()
          .setColor(0xff9200)
          .setTitle(level.name)
          .setURL(`http://zeepkist.wopian.me/level/${level.id}`)
          .setTimestamp()
          .setFooter({
            text: `Page 1 of ${Math.ceil(records.records.length / 10)}. Data provided by Zeepkist GTR`
          })
          .setDescription(`${records.totalAmount} records\n\n${recordsList}`)

        if (level.thumbnailUrl) embed.setThumbnail(level.thumbnailUrl)

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

        await interaction.reply({ embeds: [embed], components: [paginationButtons] })
      }
    } catch (error: AxiosError | any) {
      console.error(error, String(error));
      await interaction.reply({
        ephemeral: true,
        content: 'An error occurred while fetching user data. Please try again later.'
      });
    }
  }
}

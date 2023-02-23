import { getLevels, getRecords } from '@zeepkist/gtr-api'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from 'discord.js'

import { log } from '../../utils/index.js'
import { addMedalTimes } from '../fields/addMedalTimes.js'
import { addPersonalBest } from '../fields/addPersonalBest.js'
import { listRecords } from '../lists/listRecords.js'
import {
  getPaginatedData,
  PaginatedData,
  sendPaginatedMessage
} from '../paginated.js'

export const paginatedLevel = async (properties: PaginatedData) => {
  const limit = 5
  const { interaction } = properties
  const data = await getPaginatedData({ ...properties, limit })

  const { records, totalAmount } = await getRecords({
    Limit: limit,
    Offset: data.offset,
    BestOnly: true,
    LevelId: data.query?.id
  })

  let level = records[0]?.level
  if (!level) {
    log.info(
      `No records found for level. Fetching level data for ${JSON.stringify(
        data.query,
        undefined,
        2
      )}`,
      interaction
    )
    const { levels } = await getLevels({
      Id: data.query?.id,
      Author: data.query?.author,
      Name: data.query?.name,
      WorkshopId: data.query?.workshopId
    })
    if (levels.length === 1) {
      level = levels[0]
    }
  }

  const recordsList = listRecords({
    records: records,
    offset: data.offset,
    showRank: true,
    showUser: true,
    showMedal: true
  })

  log.info('Creating embed', interaction)
  const embed = new EmbedBuilder().setTitle(`${level.name}`).setAuthor({
    name: level.author
  })

  if (level.thumbnailUrl) {
    log.info('Adding thumbnail', interaction)
    embed.setThumbnail(level.thumbnailUrl.replaceAll(' ', '%20'))
  }

  await addMedalTimes({ interaction, embed, level })

  await addPersonalBest({
    interaction,
    embed,
    levelId: level.id,
    discordName: interaction.user.username,
    steamNames: records.map(({ user }) => user.steamName)
  })

  log.info('Adding best times', interaction)
  embed.addFields({
    name: 'Best Times',
    value: recordsList || 'No recent records.'
  })

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents([
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('More Stats')
      .setURL(`https://zeepkist.wopian.me/level/${level.id}`)
  ])

  if (level.workshopId !== '0') {
    buttons.addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('Subscribe to Level')
        .setURL(
          `https://steamcommunity.com/sharedfiles/filedetails/?id=${level.workshopId}`
        )
    ])
  }

  if (level.workshopId === '0' && level.author === 'Yannic') {
    let wikiName = level.name.replaceAll('Level ', '')
    if (wikiName.length === 2) wikiName = `Level%20${wikiName}`
    buttons.addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel('View Cosmetic Unlocks')
        .setURL(`https://zeepkist.fandom.com/wiki/${wikiName}`)
    ])
  }

  log.info('Sending paginated message', interaction)
  await sendPaginatedMessage({
    customId: 'level',
    interaction,
    embed,
    components: [buttons],
    query: data.query,
    currentPage: data.currentPage,
    totalAmount,
    limit
  })
}

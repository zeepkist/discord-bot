import {
  getLevels,
  getRecords,
  getUserRanking,
  User,
  UserRanking
} from '@zeepkist/gtr-api'
import { CommandInteraction, EmbedBuilder } from 'discord.js'
import { HTTPError } from 'ky'

import { formatOrdinal, log } from '../../../utils/index.js'
import { listRecords } from '../../lists/listRecords.js'

export const userEmbedRecords = async (
  interaction: CommandInteraction,
  user: User,
  embed: EmbedBuilder
) => {
  const levelsCreated = await getLevels({
    Author: user.steamName,
    Limit: 0
  })
  log.info(
    `Found ${levelsCreated.totalAmount} levels created by ${user.steamName}.`,
    interaction
  )

  let userRanking: UserRanking
  try {
    userRanking = await getUserRanking(user.id)
    log.info(`Found user ranking: ${userRanking.position}`, interaction)
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 404) {
      userRanking = {
        position: 0,
        score: 0,
        amountOfWorldRecords: 0
      }
    } else {
      throw error
    }
  }

  const userRankingScore = Math.floor(userRanking.score)

  const userRankingPosition = userRanking.position
    ? `(${formatOrdinal(userRanking.position)})`
    : ''

  const allValidRecords = await getRecords({
    UserSteamId: user.steamId,
    ValidOnly: true,
    Limit: 0
  })
  log.info(`Found ${allValidRecords.totalAmount} valid records.`, interaction)

  const allInvalidRecords = await getRecords({
    UserSteamId: user.steamId,
    InvalidOnly: true,
    Sort: '-id',
    Limit: 5
  })
  log.info(
    `Found ${allInvalidRecords.totalAmount} invalid records.`,
    interaction
  )

  const bestRecords = await getRecords({
    UserSteamId: user.steamId,
    BestOnly: true,
    Sort: '-id',
    Limit: 5
  })
  log.info(`Found ${bestRecords.totalAmount} best records.`, interaction)

  const worldRecords = await getRecords({
    UserSteamId: user.steamId,
    WorldRecordOnly: true,
    Sort: '-id',
    Limit: 5
  })
  log.info(`Found ${worldRecords.totalAmount} world records.`, interaction)

  const totalRuns = allValidRecords.totalAmount + allInvalidRecords.totalAmount
  log.info(`Found ${totalRuns} total runs.`, interaction)

  embed.addFields(
    {
      name: 'Points',
      value: `${userRankingScore} ${userRankingPosition}`.trim(),
      inline: true
    },
    {
      name: 'World Records',
      value: `${worldRecords.totalAmount}`,
      inline: true
    },
    {
      name: 'Best Times',
      value: `${bestRecords.totalAmount}`,
      inline: true
    },
    {
      name: 'any% Times',
      value: `${allInvalidRecords.totalAmount}`,
      inline: true
    },
    {
      name: 'Total Runs',
      value: `${totalRuns}`,
      inline: true
    },
    {
      name: 'Levels Created',
      value: `${levelsCreated.totalAmount}+`,
      inline: true
    }
  )

  log.info(`Getting world records for ${user.steamId}`, interaction)

  const worldRecordsList = listRecords({
    records: worldRecords.records,
    showLevel: true,
    showMedal: true
  })

  if (worldRecordsList.length > 0) {
    embed.addFields({
      name: 'Recent World Records',
      value: worldRecordsList
    })
  }

  log.info(`Getting best records for ${user.steamId}`, interaction)

  const bestRecordsList = listRecords({
    records: bestRecords.records,
    showLevel: true,
    showMedal: true
  })

  if (bestRecordsList.length > 0) {
    embed.addFields({
      name: 'Recent Bests',
      value: bestRecordsList
    })
  }

  log.info(`Getting any% records for ${user.steamId}`, interaction)

  const anyPercentRecordsList = listRecords({
    records: allInvalidRecords.records.filter(record => !record.isValid),
    showLevel: true
  })

  if (anyPercentRecordsList.length > 0) {
    embed.addFields({
      name: 'Recent any% Runs',
      value: anyPercentRecordsList
    })
  }
}

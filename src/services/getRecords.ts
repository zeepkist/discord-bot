import { gtr } from '@zeepkist/graphql'
import {
  enumRecordsOrderBy,
  isPersonalBest,
  isRecord,
  isWorldRecord,
  Record
} from '@zeepkist/graphql/gtr'
import { Level } from '@zeepkist/graphql/zworpshop'

import { PAGINATION_LIMIT } from '../config/index.js'
import { RecordType } from '../enums/index.js'
import { getLevel } from './getLevel.js'

interface ExtendedRecord
  extends Omit<
    Record,
    'level' | 'worldRecordsByRecord' | 'personalBestsByRecord'
  > {
  level: Level
  isPersonalBest?: boolean
  isWorldRecord?: boolean
}

const getValidRecords = async (offset: number) => {
  const response = await gtr.query({
    allRecords: {
      __args: {
        first: PAGINATION_LIMIT,
        offset,
        orderBy: [enumRecordsOrderBy.DATE_CREATED_DESC]
      },
      totalCount: true,
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: true
      },
      nodes: {
        time: true,
        dateCreated: true,
        level: true,
        userByUser: {
          discordId: true,
          steamId: true,
          steamName: true
        },
        worldRecordsByRecord: {
          totalCount: true
        },
        personalBestsByRecord: {
          totalCount: true
        },
        __typename: true
      }
    }
  })

  return response.allRecords
}

const getPersonalBests = async (offset: number) => {
  const response = await gtr.query({
    allPersonalBests: {
      __args: {
        first: PAGINATION_LIMIT,
        offset,
        orderBy: [enumRecordsOrderBy.DATE_CREATED_DESC]
      },
      totalCount: true,
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: true
      },
      nodes: {
        dateCreated: true,
        level: true,
        userByUser: {
          discordId: true,
          steamId: true,
          steamName: true
        },
        recordByRecord: {
          time: true
        },
        __typename: true
      }
    }
  })

  return response.allPersonalBests
}

const getWorldRecords = async (offset: number) => {
  const response = await gtr.query({
    allWorldRecords: {
      __args: {
        first: PAGINATION_LIMIT,
        offset,
        orderBy: [enumRecordsOrderBy.DATE_CREATED_DESC]
      },
      totalCount: true,
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: true
      },
      nodes: {
        time: true,
        dateCreated: true,
        level: true,
        userByUser: {
          discordId: true,
          steamId: true,
          steamName: true
        },
        recordByRecord: {
          time: true
        },
        __typename: true
      }
    }
  })

  return response.allWorldRecords
}

export const getRecords = async (offset: number, type: RecordType) => {
  const response = await (type === RecordType.WorldRecord
    ? getWorldRecords(offset)
    : type === RecordType.PersonalBest
      ? getPersonalBests(offset)
      : getValidRecords(offset))

  if (!response) return

  const nodes = await Promise.all(
    response.nodes.map(async record => {
      if (!record) return

      const level = await getLevel(record.level, {
        id: true,
        fileAuthor: true,
        name: true,
        validation: true,
        gold: true,
        silver: true,
        bronze: true
      })

      if (!level) return

      const newRecord = {
        ...record,
        level
      } as ExtendedRecord

      if (isRecord(record)) {
        newRecord.isPersonalBest = record?.personalBestsByRecord.totalCount > 0
        newRecord.isWorldRecord = record?.worldRecordsByRecord.totalCount > 0
      }

      if (isPersonalBest(record) || isWorldRecord(record)) {
        newRecord.time = record.recordByRecord?.time ?? 0
      }

      return newRecord
    })
  )

  return {
    totalCount: response?.totalCount,
    pageInfo: response?.pageInfo,
    nodes
  }
}

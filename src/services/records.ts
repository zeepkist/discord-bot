import type { RecentRecordResponse, RecordResponse } from '../models/record.js'
import { api } from './api.js'

interface GetRecordsParameters {
  LevelId?: number | string
  LevelUid?: string
  LevelWorkshopId?: number | string
  UserSteamId?: number | string
  UserId?: number | string
  BestOnly?: boolean
  ValidOnly?: boolean
  WorldRecordOnly?: boolean
  Sort?: string
  Limit?: number
  Offset?: number
}

export const getRecords = async ({
  LevelId,
  LevelUid,
  LevelWorkshopId,
  UserSteamId,
  UserId,
  BestOnly,
  ValidOnly,
  WorldRecordOnly,
  Sort,
  Limit,
  Offset
}: GetRecordsParameters = {}) => {
  const query = {
    LevelId,
    LevelUid,
    LevelWorkshopId,
    UserSteamId,
    UserId,
    BestOnly,
    ValidOnly,
    WorldRecordOnly,
    Sort,
    Limit,
    Offset
  }
  const response = await api.get('record', { params: query })

  if (response.status === 200) return response.data as RecordResponse
  else {
    throw response.data.error
  }
}

export const getRecentRecords = async ({
  LevelId,
  LevelUid,
  LevelWorkshopId,
  UserSteamId,
  UserId,
  BestOnly,
  ValidOnly,
  WorldRecordOnly,
  Limit,
  Offset
}: GetRecordsParameters = {}) => {
  const query = {
    LevelId,
    LevelUid,
    LevelWorkshopId,
    UserSteamId,
    UserId,
    BestOnly,
    ValidOnly,
    WorldRecordOnly,
    Limit,
    Offset
  }
  const response = await api.get('records/recent', { params: query })

  if (response.status === 200) return response.data as RecentRecordResponse
  else {
    throw response.data.error
  }
}

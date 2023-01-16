import type { AxiosError } from 'axios'

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
  Limit,
  Offset
}: GetRecordsParameters = {}) => {
  try {
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
    const response = await api.get('record', { params: query })

    if (response.status === 200) return response.data as RecordResponse
    else {
      throw response.data.error
    }
  } catch (error: AxiosError | unknown) {
    throw error
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
  try {
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
    const response = await api.get('record/recent', { params: query })

    if (response.status === 200) return response.data as RecentRecordResponse
    else {
      throw response.data.error
    }
  } catch (error: AxiosError | unknown) {
    throw error
  }
}

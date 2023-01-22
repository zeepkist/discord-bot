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
  InvalidOnly?: boolean
  WorldRecordOnly?: boolean
  Sort?: string
  Limit?: number
  Offset?: number
}

export const getRecords = async (query: GetRecordsParameters = {}) => {
  const response = await api.get('records', { params: query })

  if (response.status === 200) return response.data as RecordResponse
  else {
    throw response.data.error
  }
}

export const getRecentRecords = async () => {
  const response = await api.get('records/recent')

  if (response.status === 200) return response.data as RecentRecordResponse
  else {
    throw response.data.error
  }
}

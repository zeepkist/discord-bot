import type { LevelResponse } from '../models/level.js'
import { api } from './api.js'

interface GetLevelsParameters {
  Id?: number | string
  Author?: string
  Name?: string
  Uid?: string
  WorkshopId?: number | string
  Limit?: number
  Offset?: number
}

export const getLevels = async (query: GetLevelsParameters = {}) => {
  const response = await api.get('levels', { params: query })

  if (response.status === 200) return response.data as LevelResponse
  else {
    throw response.data.error
  }
}

interface SearchLevelsParameters {
  Query: string
  Limit?: number
  Offset?: number
}

export const searchLevels = async (query: SearchLevelsParameters) => {
  const response = await api.get('levels/search', { params: query })

  if (response.status === 200) return response.data as LevelResponse
  else {
    throw response.data.error
  }
}

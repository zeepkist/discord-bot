import type {
  UserRankingResponse,
  UserRankingsResponse,
  UserResponse
} from '../models/user.js'
import { api } from './api.js'

interface GetUserParameters {
  Id?: number
  SteamId?: string
}

export const getUser = async ({ Id, SteamId }: GetUserParameters) => {
  const response = await (Id
    ? api.get('users/id', { params: { Id } })
    : api.get('users/steamid', { params: { SteamId } }))

  if (response.status === 200) return response.data as UserResponse
  else {
    throw response.data.error
  }
}

export const getUserRanking = async (query: GetUserParameters = {}) => {
  const response = await api.get('users/ranking', { params: query })

  if (response.status === 200) return response.data as UserRankingResponse
  else {
    throw response.data.error
  }
}

interface GetUserRankingsParameters {
  Limit?: number
  Offset?: number
}

export const getUserRankings = async (
  query: GetUserRankingsParameters = {}
) => {
  const response = await api.get('users/rankings', { params: query })

  if (response.status === 200) return response.data as UserRankingsResponse
  else {
    throw response.data.error
  }
}

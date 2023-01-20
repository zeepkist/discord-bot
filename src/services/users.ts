import type { UserRankingsResponse, UserResponse } from '../models/user.js'
import { api } from './api.js'

interface GetUserParameters {
  id?: number
  steamId?: string
}

export const getUser = async ({ id, steamId }: GetUserParameters) => {
  const response = await (id
    ? api.get('users/id', { params: { id } })
    : api.get('users/steamid', { params: { SteamId: steamId } }))

  if (response.status === 200) return response.data as UserResponse
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

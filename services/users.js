import { api } from './api.js'

export const getUser = async ({ id, steamId }) => {
  const response = await (id
    ? api.get('users/id', { params: { id } })
    : api.get('users/steamid', { params: { SteamId: steamId } }))
  if (response.status === 200) return response.data
  else {
    throw response.data.error
  }
}
export const getUserRankings = async (query = {}) => {
  const response = await api.get('users/rankings', { params: query })
  if (response.status === 200) return response.data
  else {
    throw response.data.error
  }
}

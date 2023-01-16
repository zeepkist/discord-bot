import type { AxiosError } from 'axios'

import type { UserResponse } from '../models/user.js'
import { api } from './api.js'

interface GetUserParameters {
  id?: number
  steamId?: string
}

export const getUser = async ({ id, steamId }: GetUserParameters) => {
  try {
    const response = await (id
      ? api.get('user/id', { params: { id } })
      : api.get('user/steamid', { params: { SteamId: steamId } }))

    if (response.status === 200) return response.data as UserResponse
    else {
      throw response.data.error
    }
  } catch (error: AxiosError | unknown) {
    throw error
  }
}

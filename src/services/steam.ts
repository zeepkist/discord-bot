import axios from 'axios'

import { STEAM_API_URL } from '../constants.js'
import { PlayerSummmary } from '../models/steam.js'

const key = process.env.STEAM_KEY
const api = axios.create({
  baseURL: STEAM_API_URL
})

export const getPlayerSummaries = async (steamIds: string[]) => {
  const response = await api.get('ISteamUser/GetPlayerSummaries/v0002/', {
    params: {
      key,
      steamids: steamIds.join(',')
    }
  })

  if (response.status === 200) return response.data as PlayerSummmary
  else {
    throw response.data.error
  }
}

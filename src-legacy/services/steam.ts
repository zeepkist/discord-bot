import ky from 'ky'

import { STEAM_API_URL } from '../constants.js'
import { PlayerSummmary } from '../models/steam.js'
import { log } from '../utils/index.js'

const key = process.env.STEAM_KEY
const api = ky.create({
  prefixUrl: STEAM_API_URL
})

export const getPlayerSummaries = async (steamIds: string[]) => {
  const searchParameters = new URLSearchParams({
    key: key ?? '',
    steamids: steamIds.join(',')
  })

  log.info(`Fetching player summaries for ${steamIds.join(', ')}`)

  const response = await api.get('ISteamUser/GetPlayerSummaries/v0002/', {
    searchParams: searchParameters
  })

  if (response.ok) return response.json() as Promise<PlayerSummmary>
  else {
    throw response.json()
  }
}

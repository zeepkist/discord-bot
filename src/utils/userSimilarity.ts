import { distance } from 'fastest-levenshtein'

const cleanup = (name: string) =>
  name.toLowerCase().replaceAll(/\[.*]/g, '').trim()

export const userSimilarity = (discordName: string, steamNames: string[]) => {
  const name = cleanup(discordName)
  const nameSimilarity = steamNames.map(steamName =>
    distance(name, cleanup(steamName))
  )
  return Math.min(...nameSimilarity)
}

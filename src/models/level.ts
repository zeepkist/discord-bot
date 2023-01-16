export interface Level {
  id: number
  uniqueId: string
  workshopId: string
  name: string
  author: string
  timeAuthor: number
  timeGold: number
  timeSilver: number
  timeBronze: number
  thumbnailUrl: string
}

export interface LevelResponse {
  totalAmount: number
  levels: Level[]
}

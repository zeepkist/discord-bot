export interface User {
  id: number
  steamId: string
  steamName: string
}

export interface UserRankings {
  user: User
  amountOfWorldRecords: number
  position: number
}

export type UserResponse = User

export interface UserRankingsResponse {
  totalAmount: number
  rankings: UserRankings[]
}

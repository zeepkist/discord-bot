import type { Level } from './level.js'
import type { User } from './user.js'

export interface LevelRecord {
  id: number
  dateCreated: string
  time: number
  splits: number[]
  ghostUrl: string
  screenshotUrl: string
  isBest: boolean
  isValid: boolean
  isWorldRecord: boolean
  gameVersion: string
  user: User
  level: Level
}

export interface RecordResponse {
  totalAmount: number
  records: LevelRecord[]
}

export interface RecentRecordResponse {
  records: LevelRecord[]
}

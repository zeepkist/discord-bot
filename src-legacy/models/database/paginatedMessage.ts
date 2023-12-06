export interface PaginatedMessageQuery {
  worldRecordsOnly?: boolean
  id?: number
  workshopId?: string
  author?: string
  name?: string
}

export interface PaginatedMessage {
  messageId: string
  currentPage: number
  query: string | PaginatedMessageQuery
  createdAt: Date
  updatedAt: Date
}

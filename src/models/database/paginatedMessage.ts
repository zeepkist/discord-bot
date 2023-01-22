export interface PaginatedMessageQuery {
  worldRecordsOnly?: boolean
}

export interface PaginatedMessage {
  messageId: string
  currentPage: number
  query: string | PaginatedMessageQuery
  createdAt: Date
  updatedAt: Date
}

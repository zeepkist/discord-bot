import { Button, PaginatedButton } from './button.js'
import { pagination } from './buttons/pagination.js'
import { submitToken } from './buttons/submitToken.js'

export const buttons: (Button | PaginatedButton)[] = [pagination, submitToken]

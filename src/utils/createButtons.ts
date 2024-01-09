import { pagination } from '../buttons/pagination.js'
import { Button, PaginatedButton } from '../types/index.js'

const buttons: (Button | PaginatedButton)[] = [pagination]

export const createButtons = () => buttons

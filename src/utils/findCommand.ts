import {
  Button,
  Command,
  ContextMenu,
  PaginatedButton
} from '../types/index.js'

export const findCommand = <
  T extends Command | ContextMenu | Button | PaginatedButton
>(
  array: T[],
  name: string
): T | undefined => array.find(command => command.name === name)

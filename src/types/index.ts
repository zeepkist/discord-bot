import {
  ButtonInteraction,
  ChatInputApplicationCommandData,
  CommandInteraction,
  User,
  UserApplicationCommandData
} from 'discord.js'

import { PaginatedButtonActionEnum } from '../enums/index.js'

export interface Command extends ChatInputApplicationCommandData {
  ephemeral: boolean
  run: (interaction: CommandInteraction, discordId?: string) => void
}

export interface ContextMenu extends UserApplicationCommandData {
  ephemeral: boolean
  run: (interaction: CommandInteraction, user: User) => void
}

export interface Button {
  name: string
  type?: 'pagination' | undefined
  run: (interaction: ButtonInteraction) => void
}

export type PaginatedButtonAction =
  | PaginatedButtonActionEnum.First
  | PaginatedButtonActionEnum.Previous
  | PaginatedButtonActionEnum.Next
  | PaginatedButtonActionEnum.Last

export interface PaginatedButton extends Omit<Button, 'run' | 'type'> {
  type: 'pagination'
  run: (
    interaction: ButtonInteraction,
    command: string,
    action: PaginatedButtonAction
  ) => void
}

/**
 * Pagination buttons
 */
export interface CollectorFilterValue {
  customId: string
}

import { ButtonInteraction } from 'discord.js'

export interface Button {
  name: string
  type?: 'pagination' | undefined
  run: (interaction: ButtonInteraction) => void
}

export type PaginatedButtonAction = 'first' | 'previous' | 'next' | 'last'

export interface PaginatedButton extends Omit<Button, 'run' | 'type'> {
  type: 'pagination'
  run: (
    interaction: ButtonInteraction,
    command: string,
    action: PaginatedButtonAction
  ) => void
}

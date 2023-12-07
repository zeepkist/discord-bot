import {
  ButtonInteraction,
  ChatInputApplicationCommandData,
  CommandInteraction,
  User,
  UserApplicationCommandData
} from 'discord.js'

export const enum CommandName {
  Command = 'command',
  ContextMenu = 'contextMenu'
}

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

export type PaginatedButtonAction = 'first' | 'previous' | 'next' | 'last'

export interface PaginatedButton extends Omit<Button, 'run' | 'type'> {
  type: 'pagination'
  run: (
    interaction: ButtonInteraction,
    command: string,
    action: PaginatedButtonAction
  ) => void
}

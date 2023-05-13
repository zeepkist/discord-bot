import {
  CommandInteraction,
  User,
  UserApplicationCommandData
} from 'discord.js'

export interface ContextMenu extends UserApplicationCommandData {
  ephemeral: boolean
  run: (interaction: CommandInteraction, user: User) => void
}

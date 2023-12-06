import { ChatInputApplicationCommandData, CommandInteraction } from 'discord.js'

export interface Command extends ChatInputApplicationCommandData {
  ephemeral: boolean
  run: (interaction: CommandInteraction, discordId?: string) => void
}

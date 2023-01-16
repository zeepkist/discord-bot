import {
  ChatInputApplicationCommandData,
  Client,
  CommandInteraction
} from 'discord.js'

export interface Command extends ChatInputApplicationCommandData {
  run: (interaction: CommandInteraction) => void
}

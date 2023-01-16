import { CommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    run: (interaction: CommandInteraction) => void;
}

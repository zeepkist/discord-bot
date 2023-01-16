import { ApplicationCommandType } from "discord.js";
export const hello = {
    name: "hello",
    description: "Say hello to the bot!",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const content = 'Hello, world!';
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};

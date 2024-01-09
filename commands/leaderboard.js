import { ApplicationCommandType } from 'discord.js';
import { createLeaderboard } from '../components/createLeaderboard.js';
export const leaderboard = {
    name: 'leaderboard',
    description: 'View the Zeepkist GTR points leaderboard',
    type: ApplicationCommandType.ChatInput,
    ephemeral: false,
    run: async (interaction) => {
        await createLeaderboard({
            interaction,
            action: "first"
        });
    }
};

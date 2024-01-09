import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
import { createRecords } from '../components/createRecords.js';
const options = [
    {
        name: 'user',
        description: 'View recent records by a user',
        type: ApplicationCommandOptionType.User
    }
];
export const records = {
    name: 'records',
    description: 'View recent World Records, Personal Bests other records',
    type: ApplicationCommandType.ChatInput,
    ephemeral: false,
    options: [
        {
            name: 'wr',
            description: 'View recent World Records',
            type: ApplicationCommandOptionType.Subcommand,
            options
        },
        {
            name: 'pb',
            description: 'View recent Personal Bests',
            type: ApplicationCommandOptionType.Subcommand,
            options
        },
        {
            name: 'all',
            description: 'View all recent records',
            type: ApplicationCommandOptionType.Subcommand,
            options
        }
    ],
    run: async (interaction) => {
        const user = interaction.options.getUser('user');
        const subcommand = interaction.options.data.find(option => option.type === ApplicationCommandOptionType.Subcommand)?.name;
        const recordType = subcommand === 'wr'
            ? "wr"
            : subcommand === 'pb'
                ? "pb"
                : "all";
        await createRecords({
            interaction,
            action: "first",
            query: {
                user,
                recordType
            }
        });
    }
};

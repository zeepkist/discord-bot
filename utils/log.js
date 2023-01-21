import { format } from 'date-fns';
import { CommandInteraction } from 'discord.js';
const guildName = (interaction) => interaction.guild?.name || 'Unknown guild';
const interactionName = (interaction) => interaction instanceof CommandInteraction
    ? interaction.commandName
    : interaction.customId;
const date = format(Date.now(), 'yyyy-MM-dd HH:mm:ss');
export const log = {
    info: (interaction, message) => {
        const guild = guildName(interaction);
        const name = interactionName(interaction);
        console.log(`[${date}][${name}][${guild}]: ${message}`);
    },
    error: (interaction, message) => {
        const guild = guildName(interaction);
        const name = interactionName(interaction);
        console.log(`[${date}][${name}][${guild}]: ${message}`);
    }
};

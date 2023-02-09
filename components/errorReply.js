import { log } from '../utils/index.js';
export const errorReply = async (interaction, command, error) => {
    log.error(`An error occured processing the "${command}" command.\n\n${String(error)}`, interaction);
    log.error(error, interaction);
    await interaction.reply({
        ephemeral: true,
        content: 'An unexpected error occured while processing your request. Please try again later.'
    });
    setTimeout(() => interaction.deleteReply(), 15_000);
};

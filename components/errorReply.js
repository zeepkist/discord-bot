import { log } from '../utils/index.js';
export const errorReply = async (interaction, command, error) => {
    log.error(`An error occured processing the "${command}" command.\n\n${String(error)}`, interaction);
    log.error(JSON.stringify(error, undefined, 2), interaction);
    await interaction.editReply({
        content: 'An unexpected error occured while processing your request. Please try again later.'
    });
    setTimeout(() => interaction.deleteReply(), 15_000);
};

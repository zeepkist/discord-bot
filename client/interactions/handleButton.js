import { createButtons } from '../../utils/createButtons.js';
import { findCommand, log } from '../../utils/index.js';
const buttons = createButtons();
export const handleButton = async (interaction) => {
    log.info('Handling request as a pagination button', interaction);
    const [buttonName, action, type] = interaction.customId.split('-');
    const button = findCommand(buttons, buttonName);
    if (!button) {
        log.error(`Unknown button interaction "${interaction.customId}"`, interaction);
        interaction.reply({
            content: 'Unknown button interaction',
            ephemeral: true
        });
        return;
    }
    button.run(interaction, type, action);
};

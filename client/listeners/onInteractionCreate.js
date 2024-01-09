import { handleButton } from '../interactions/handleButton.js';
import { handleMessageContextMenuCommand } from '../interactions/handleMessageContextMenuCommand.js';
import { handleSlashCommand } from '../interactions/handleSlashCommand.js';
import { handleUserContextMenuCommand } from '../interactions/handleUserContextMenuCommand.js';
export const onInteractionCreate = async (interaction) => {
    if (interaction.isUserContextMenuCommand()) {
        handleUserContextMenuCommand(interaction);
    }
    else if (interaction.isMessageContextMenuCommand()) {
        handleMessageContextMenuCommand(interaction);
    }
    else if (interaction.isCommand()) {
        handleSlashCommand(interaction);
    }
    else if (interaction.isButton()) {
        handleButton(interaction);
    }
};

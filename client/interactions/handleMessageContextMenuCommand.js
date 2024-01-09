import { createContextMenus } from '../../utils/createContextMenus.js';
import { log } from '../../utils/log.js';
const contextMenus = createContextMenus();
export const handleMessageContextMenuCommand = async (interaction) => {
    log.info('Handling request as a message context menu command', interaction);
    if (!interaction.isUserContextMenuCommand())
        return;
    const contextMenu = contextMenus.find(command => command.name === interaction.commandName);
    if (!contextMenu) {
        interaction.reply({ content: 'Unknown command', ephemeral: true });
        return;
    }
    await interaction.deferReply({
        ephemeral: true
    });
    contextMenu.run(interaction, interaction.targetUser);
};

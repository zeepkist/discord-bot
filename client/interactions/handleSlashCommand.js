import { createCommands } from '../../utils/createCommands.js';
import { findCommand, log } from '../../utils/index.js';
const commands = createCommands();
export const handleSlashCommand = async (interaction) => {
    log.info('Handling request as a slash command', interaction);
    const command = findCommand(commands, interaction.commandName);
    if (!command) {
        interaction.reply({ content: 'Unknown command', ephemeral: true });
        return;
    }
    await interaction.deferReply({
        ephemeral: command.ephemeral
    });
    command.run(interaction);
};

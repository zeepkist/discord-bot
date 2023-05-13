import { buttons } from '../buttons.js';
import { commands } from '../commands.js';
import { trackCommandUsage } from '../components/trackCommandUsage.js';
import { contextMenus } from '../contextMenus.js';
import { log } from '../utils/index.js';
export default (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isUserContextMenuCommand()) {
            await handleUserContextMenuCommand(interaction);
        }
        else if (interaction.isCommand()) {
            await handleSlashCommand(interaction);
        }
        else if (interaction.isButton() &&
            interaction.customId.startsWith('pagination')) {
            await handlePaginatedButton(interaction);
        }
        else if (interaction.isButton()) {
            await handleButton(interaction);
        }
    });
};
const handleUserContextMenuCommand = async (interaction) => {
    log.info('Handling request as user context menu command', interaction);
    if (!interaction.isUserContextMenuCommand())
        return;
    const { username, id } = interaction.targetUser;
    log.info(`Got user context menu command for ${username} (${id})`);
    const contextMenu = contextMenus.find(command => command.name === interaction.commandName);
    if (!contextMenu) {
        interaction.reply({ content: 'Unknown command', ephemeral: true });
        return;
    }
    await trackCommandUsage(interaction.commandName);
    await interaction.deferReply({
        ephemeral: true
    });
    contextMenu.run(interaction, interaction.targetUser);
};
const handleSlashCommand = async (interaction) => {
    log.info('Handling request as command', interaction);
    const slashCommand = commands.find(command => command.name === interaction.commandName);
    if (!slashCommand) {
        interaction.reply({ content: 'Unknown command', ephemeral: true });
        return;
    }
    await trackCommandUsage(interaction.commandName);
    await interaction.deferReply({
        ephemeral: slashCommand.ephemeral
    });
    slashCommand.run(interaction);
};
const handlePaginatedButton = async (interaction) => {
    log.info('Handling request as pagination button', interaction);
    const [buttonName, action, type] = interaction.customId.split('-');
    const button = buttons.find(button => button.name === buttonName);
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
const handleButton = async (interaction) => {
    log.info('Handling request as button', interaction);
    const button = buttons.find(button => button.name === interaction.customId);
    if (!button) {
        log.error(`Unknown button interaction "${interaction.customId}"`, interaction);
        interaction.reply({
            content: 'Unknown button interaction',
            ephemeral: true
        });
        return;
    }
    button?.run(interaction);
};

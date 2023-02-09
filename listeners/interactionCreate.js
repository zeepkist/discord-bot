import { buttons } from '../buttons.js';
import { commands } from '../commands.js';
import { trackCommandUsage } from '../components/trackCommandUsage.js';
import { modalSubmissions } from '../modalSubmissions.js';
import { log } from '../utils/index.js';
export default (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(interaction);
        }
        else if (interaction.isButton() &&
            interaction.customId.startsWith('pagination')) {
            await handlePaginatedButton(interaction);
        }
        else if (interaction.isButton()) {
            await handleButton(interaction);
        }
        else if (interaction.isModalSubmit()) {
            await handleModalSubmit(interaction);
        }
    });
};
const handleSlashCommand = async (interaction) => {
    log.info('Handling request as command', interaction);
    const slashCommand = commands.find(command => command.name === interaction.commandName);
    if (!slashCommand) {
        interaction.reply({ content: 'Unknown command', ephemeral: true });
        return;
    }
    await trackCommandUsage(interaction.commandName);
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
const handleModalSubmit = async (interaction) => {
    log.info('Handling request as modal submission', interaction);
    const modal = modalSubmissions.find(modal => modal.name === interaction.customId);
    if (!modal) {
        log.error(`Unknown modal submission "${interaction.customId}"`, interaction);
        interaction.reply({ content: 'Unknown modal submission', ephemeral: true });
        return;
    }
    modal?.run(interaction);
};

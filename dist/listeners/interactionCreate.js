import { buttons } from '../buttons.js';
import { commands } from '../commands.js';
import { modalSubmissions } from '../modalSubmissions.js';
export default (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(interaction);
        }
        if (interaction.isButton()) {
            await handleButton(interaction);
        }
        if (interaction.isModalSubmit()) {
            await handleModalSubmit(interaction);
        }
    });
};
const handleSlashCommand = async (interaction) => {
    console.log(`[${interaction.commandName}]: Handling request from "${interaction.guild?.name}"`);
    const slashCommand = commands.find(command => command.name === interaction.commandName);
    if (!slashCommand) {
        interaction.reply({ content: 'Unknown command', ephemeral: true });
        return;
    }
    slashCommand.run(interaction);
};
const handleButton = async (interaction) => {
    console.log(`[button]: Handling request from "${interaction.guild?.name}"`);
    const button = buttons.find(button => button.name === interaction.customId);
    console.log(button);
    button?.run(interaction);
};
const handleModalSubmit = async (interaction) => {
    console.log(`[modal]: Handling request from "${interaction.guild?.name}"`);
    const modal = modalSubmissions.find(modal => modal.name === interaction.customId);
    console.log(modal);
    modal?.run(interaction);
};

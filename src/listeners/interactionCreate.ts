import { Client, CommandInteraction, Interaction } from 'discord.js'

import { commands } from '../commands.js'

export default (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(interaction)
    }
  })
}

const handleSlashCommand = async (
  interaction: CommandInteraction
): Promise<void> => {
  console.log(
    `[${interaction.commandName}]: Handling request from "${interaction.guild?.name}"`
  )

  const slashCommand = commands.find(
    command => command.name === interaction.commandName
  )
  if (!slashCommand) {
    interaction.reply({ content: 'Unknown command', ephemeral: true })
    return
  }

  slashCommand.run(interaction)
}

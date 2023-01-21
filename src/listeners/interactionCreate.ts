import {
  ButtonInteraction,
  Client,
  CommandInteraction,
  Interaction,
  ModalSubmitInteraction
} from 'discord.js'

import { buttons } from '../buttons.js'
import { commands } from '../commands.js'
import { trackCommandUsage } from '../components/trackCommandUsage.js'
import { modalSubmissions } from '../modalSubmissions.js'
import { log } from '../utils/index.js'

export default (client: Client): void => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(interaction)
    }
    if (interaction.isButton()) {
      await handleButton(interaction)
    }
    if (interaction.isModalSubmit()) {
      await handleModalSubmit(interaction)
    }
  })
}

const handleSlashCommand = async (
  interaction: CommandInteraction
): Promise<void> => {
  log.info(interaction, 'Handling request')

  const slashCommand = commands.find(
    command => command.name === interaction.commandName
  )
  if (!slashCommand) {
    interaction.reply({ content: 'Unknown command', ephemeral: true })
    return
  }

  await trackCommandUsage(interaction.commandName)

  slashCommand.run(interaction)
}

const handleButton = async (interaction: ButtonInteraction): Promise<void> => {
  log.info(interaction, 'Handling request')

  const button = buttons.find(button => button.name === interaction.customId)

  if (!button) {
    console.log('Unknown button interaction', interaction.customId)
    interaction.reply({
      content: 'Unknown button interaction',
      ephemeral: true
    })
    return
  }

  button?.run(interaction)
}

const handleModalSubmit = async (
  interaction: ModalSubmitInteraction
): Promise<void> => {
  log.info(interaction, 'Handling request')

  const modal = modalSubmissions.find(
    modal => modal.name === interaction.customId
  )

  if (!modal) {
    console.log('Unknown button interaction', interaction.customId)
    interaction.reply({ content: 'Unknown modal submission', ephemeral: true })
    return
  }

  modal?.run(interaction)
}

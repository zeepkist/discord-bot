import { CommandInteraction } from 'discord.js'

import { createContextMenus } from '../../contextMenus/createContextMenus.js'
import { findCommand, log } from '../../utils/index.js'

const contextMenus = createContextMenus()

export const handleUserContextMenuCommand = async (
  interaction: CommandInteraction
) => {
  log.info('Handling request as a user context menu command', interaction)

  if (!interaction.isUserContextMenuCommand()) return

  const { username, id } = interaction.targetUser

  log.info(`Got user context menu command for ${username} (${id})`)

  const command = findCommand(contextMenus, interaction.commandName)

  if (!command) {
    interaction.reply({ content: 'Unknown command', ephemeral: true })
    return
  }

  // await trackCommandUsage(interaction.commandName)

  await interaction.deferReply({
    ephemeral: true
  })

  command.run(interaction, interaction.targetUser)
}

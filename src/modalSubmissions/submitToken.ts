import { constants, privateDecrypt } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js'

import { alreadyLinkedReply } from '../components/accountAlreadyLinked.js'
import { database } from '../services/database.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const privateKey = readFileSync(join(__dirname, '../../private.pem'), 'utf8')

const decryptSteamId = (token: string): string =>
  privateDecrypt(
    { key: privateKey, padding: constants.RSA_PKCS1_OAEP_PADDING },
    Buffer.from(token, 'base64url')
  ).toString()

const invalidTokenReply = (interaction: ModalSubmitInteraction): void => {
  const embed = new EmbedBuilder()
    .setTitle('Invalid Token')
    .setDescription(
      'The token you provided is invalid. Please make sure you have copied the entire token and try again.'
    )
    .setColor('#ff0000')
    .setTimestamp()

  interaction.reply({ embeds: [embed], ephemeral: true })
}

export const submitToken = {
  name: 'submitTokenModal',
  run: async (interaction: ModalSubmitInteraction): Promise<void> => {
    const token = interaction.fields.getTextInputValue('token')
    const discordId = interaction.user.id

    let steamId
    try {
      steamId = decryptSteamId(token)
      if (steamId.length !== 17) {
        throw new Error('Invalid steamId length')
      }
    } catch (error: unknown) {
      console.error(error)
      invalidTokenReply(interaction)
      return
    }

    let response
    try {
      response = await database('linked_accounts').insert({
        discordId,
        steamId
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message.includes('Duplicate entry')) {
        alreadyLinkedReply(interaction)
        return
      }
      console.error(error)
      invalidTokenReply(interaction)
    }

    if (!response) return

    const embed = new EmbedBuilder()
      .setTitle('Accounts Linked')
      .setDescription(
        'Your Discord and Steam accounts have been linked. You can now use the `/user` command to view your stats!'
      )
      .setColor('#00ff00')
      .setTimestamp()

    interaction.reply({ embeds: [embed], ephemeral: true })
  }
}

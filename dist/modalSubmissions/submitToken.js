import { constants, privateDecrypt } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EmbedBuilder } from 'discord.js';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const privateKey = readFileSync(join(__dirname, '../../private.pem'), 'utf8');
const decryptSteamId = (token) => privateDecrypt({ key: privateKey, padding: constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from(token, 'base64url')).toString();
export const submitToken = {
    name: 'submitTokenModal',
    run: async (interaction) => {
        const token = interaction.fields.getTextInputValue('token');
        console.log('token', token);
        const steamId = decryptSteamId(token);
        console.log('steam', steamId);
        const discordId = interaction.user.id;
        console.log('discord', discordId);
        const embed = new EmbedBuilder()
            .setTitle('Accounts Linked')
            .setDescription('Your Discord and Steam accounts have been linked. You can now use the `/user` command to view your stats!')
            .setColor('#00ff00')
            .setTimestamp();
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};

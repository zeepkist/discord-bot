import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
export const submitToken = {
    name: 'submitTokenButton',
    run: async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('submitTokenModal')
            .setTitle('Link your Steam and Discord accounts');
        const tokenInput = new TextInputBuilder()
            .setCustomId('token')
            .setLabel('Enter the code from thezeepkistpodium.com')
            .setPlaceholder('eyJzdGVhbWlkIjoiMDAwMDAwMDAwMDAwMDAwMDAifQ.oUVEWIWAk16oc9w81IrZOv0XDEaSYf7Dpo1xLehDzys')
            .setStyle(TextInputStyle.Short);
        const row = new ActionRowBuilder().addComponents(tokenInput);
        modal.addComponents(row);
        interaction.showModal(modal);
    }
};

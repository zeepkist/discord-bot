import { PAGINATION_LIMIT } from '../constants.js';
import { database } from '../services/database.js';
import { extractPages, log, providedBy } from '../utils/index.js';
import { paginationButtons } from './paginationButtons.js';
const setCurrentPage = (action, currentPage, totalPages) => {
    switch (action) {
        case 'first': {
            return 1;
        }
        case 'previous': {
            return currentPage - 1;
        }
        case 'next': {
            return currentPage + 1;
        }
        case 'last': {
            return totalPages;
        }
        default: {
            return currentPage;
        }
    }
};
export const getPaginatedData = async (properties) => {
    const { interaction, action, query, limit } = properties;
    const isUpdatingMessage = interaction.isMessageComponent();
    const paginatedMessage = isUpdatingMessage
        ? await database('paginated_messages')
            .where({
            messageId: interaction.message.interaction?.id
        })
            .select('query')
            .first()
        : undefined;
    const activeQuery = paginatedMessage
        ? JSON.parse(paginatedMessage.query)
        : query ?? {};
    const pages = extractPages(isUpdatingMessage ? interaction.message.embeds[0].footer?.text : undefined);
    const currentPage = setCurrentPage(action, pages.currentPage, pages.totalPages);
    const offset = (currentPage - 1) * (limit ?? PAGINATION_LIMIT);
    return {
        interactionId: interaction.id,
        query: activeQuery,
        currentPage,
        totalPages: pages.totalPages,
        offset
    };
};
export const sendPaginatedMessage = async ({ customId, interaction, embed, components, currentPage, totalAmount, query, limit }) => {
    const totalPages = Math.ceil(totalAmount / (limit ?? PAGINATION_LIMIT));
    log.info(`Obtained ${totalAmount} ${customId}. Showing page ${currentPage} of ${totalPages}`, interaction);
    embed
        .setColor(0xff_92_00)
        .setFooter({
        text: `Page ${currentPage} of ${totalPages}. ${providedBy}`
    })
        .setTimestamp();
    const pagination = paginationButtons(interaction, customId, currentPage, totalPages);
    const isUpdatingMessage = interaction.isMessageComponent();
    const messageContent = {
        embeds: [embed],
        components: [
            ...(pagination ? [pagination] : []),
            ...(components && components?.length > 0 ? components : [])
        ]
    };
    if (isUpdatingMessage) {
        log.info(`Updating message ${interaction.message.interaction?.id}`, interaction);
        await interaction.update(messageContent);
        await database('paginated_messages')
            .update({
            currentPage,
            updatedAt: new Date(Date.now())
        })
            .where({
            messageId: interaction.message.interaction?.id
        });
    }
    else {
        log.info(`Sending new message`, interaction);
        const response = await interaction.reply(messageContent);
        await database('paginated_messages').insert({
            messageId: response.interaction.id,
            query: JSON.stringify(query)
        });
    }
};

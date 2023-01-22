import { paginatedRecent } from '../components/paginated/paginatedRecent.js';
export const pagination = {
    name: 'paginationButton',
    type: 'pagination',
    run: async (interaction, command, action) => {
        switch (command) {
            case 'recent': {
                await paginatedRecent({ interaction, action });
            }
        }
    }
};

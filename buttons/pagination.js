import { paginatedLevel } from '../components/paginated/paginatedLevel.js';
import { paginatedLevels } from '../components/paginated/paginatedLevels.js';
import { paginatedRecent } from '../components/paginated/paginatedRecent.js';
export const pagination = {
    name: 'paginationButton',
    type: 'pagination',
    run: async (interaction, command, action) => {
        switch (command) {
            case 'recent': {
                await paginatedRecent({ interaction, action });
                break;
            }
            case 'level': {
                await paginatedLevel({ interaction, action });
                break;
            }
            case 'levels': {
                await paginatedLevels({ interaction, action });
                break;
            }
        }
    }
};

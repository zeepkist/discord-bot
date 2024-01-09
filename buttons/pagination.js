import { createLeaderboard } from '../components/createLeaderboard.js';
import { createRecords } from '../components/createRecords.js';
import { log } from '../utils/index.js';
export const pagination = {
    name: 'paginationButton',
    type: 'pagination',
    run: async (interaction, command, action) => {
        switch (command) {
            case "leaderboard": {
                await createLeaderboard({ interaction, action });
                break;
            }
            case "records": {
                await createRecords({ interaction, action });
                break;
            }
            default: {
                log.error(`Unknown pagination button command: ${command}`);
                break;
            }
        }
    }
};

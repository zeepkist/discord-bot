import { MEDAL } from './medal.js';
export const bestMedal = (record) => {
    if (record.isWorldRecord)
        return MEDAL.WR;
    else if (record.time < record.level.timeAuthor)
        return MEDAL.AUTHOR;
    else if (record.time < record.level.timeGold)
        return MEDAL.GOLD;
    else if (record.time < record.level.timeSilver)
        return MEDAL.SILVER;
    else if (record.time < record.level.timeBronze)
        return MEDAL.BRONZE;
    else
        return MEDAL.NONE;
};

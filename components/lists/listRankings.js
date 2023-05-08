import { bold } from 'discord.js';
import { formatRank, formatUser } from '../../utils/index.js';
export const listRankings = ({ rankings, offset = 0 }) => rankings
    .map((ranking, index) => {
    const rank = formatRank(index + 1 + offset);
    const user = formatUser(ranking.user);
    const wrs = bold(String(ranking.amountOfWorldRecords));
    const flooredScore = Math.floor(ranking.score);
    const score = bold(String(flooredScore));
    return `${rank} ${user} with ${score} point${flooredScore === 1 ? '' : 's'} (${wrs} WR${ranking.amountOfWorldRecords === 1 ? '' : 's'})`;
})
    .join('\n');

import { formatLevel, formatRank } from '../../utils/index.js';
export const listLevels = ({ levels, offset = 0, showRank = false, showId = false }) => levels
    .map((level, index) => {
    const rank = showRank ? formatRank(index + 1 + offset) : '';
    const name = formatLevel(level);
    const id = showId ? `(${level.id})` : '';
    return `${rank} ${name} ${id}`.replaceAll('  ', ' ');
})
    .join('\n');

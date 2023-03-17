import { getMonthlyStats } from '../../services/database/twitchStreams.js';
import { log } from '../../utils/index.js';
import { twitchStatsEmbed } from './statsEmbed.js';
export const sendMonthlyStats = async (channel) => {
    const data = await getMonthlyStats();
    if (!data)
        return;
    const embed = twitchStatsEmbed(data);
    await channel.send({ embeds: [embed] });
    log.info('Sent stats message');
};

import { updateStream } from '../../services/database/twitchStreams.js';
import { log } from '../../utils/index.js';
import { getChannelMessage } from '../getChannelMessage.js';
import { twitchEmbed } from './embed.js';
export const updateMessage = async (channel, knownStream, { component, stream, streamsThisMonth, profilePictureUrl }) => {
    if (!knownStream.messageId)
        return;
    const embed = await twitchEmbed(stream, streamsThisMonth, profilePictureUrl);
    const message = await getChannelMessage(channel, knownStream.messageId, {
        embeds: [embed],
        components: [component]
    });
    if (!message)
        return;
    await updateStream(knownStream.messageId, {
        messageId: message.id,
        viewers: stream.viewers,
        peakViewers: Math.max(stream.viewers, knownStream.peakViewers)
    });
    knownStream.messageId = message.id;
    message.edit({ embeds: [embed], components: [component] });
    log.info(`Updated ${stream.userName}'s stream`);
};

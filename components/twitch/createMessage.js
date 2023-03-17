import { addStream } from '../../services/database/twitchStreams.js';
import { log } from '../../utils/index.js';
import { twitchEmbed } from './embed.js';
export const createMessage = async (channel, knownStreams, { component, stream, streamsThisMonth, profilePictureUrl }) => {
    const embed = await twitchEmbed(stream, streamsThisMonth + 1, profilePictureUrl);
    const message = await channel.send({
        embeds: [embed],
        components: [component]
    });
    const streamData = {
        isLive: true,
        streamId: stream.id,
        messageId: message.id,
        createdAt: stream.startDate,
        updatedAt: new Date(Date.now()),
        userId: stream.userId,
        userName: stream.userName,
        profilePictureUrl,
        viewers: stream.viewers,
        peakViewers: stream.viewers
    };
    await addStream(streamData);
    knownStreams.push(streamData);
    log.info(`Announced ${stream.userName}'s stream`);
};

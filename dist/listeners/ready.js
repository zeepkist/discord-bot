import { commands } from '../commands.js';
export default async (client) => {
    if (!client.user || !client.application)
        return;
    await client.application.commands.set(commands);
    console.log(`${client.user.username} is online!`);
};

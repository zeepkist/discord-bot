import { gtr } from '@zeepkist/graphql';
export const getUserByDiscordId = async (discordId) => {
    const users = await getUsers({
        nodes: {
            id: true
        },
        condition: {
            discordId
        }
    });
    return users?.nodes[0];
};
export const getUsers = async (options) => {
    const { nodes, condition } = options ?? {};
    const response = await gtr.query({
        allUsers: {
            __args: {
                condition
            },
            nodes: nodes ?? {
                id: true,
                name: true
            }
        }
    });
    return response.allUsers;
};

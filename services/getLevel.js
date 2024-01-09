import { zworpshop } from '@zeepkist/graphql';
export const getLevel = async (fileHash, nodes) => {
    const response = await zworpshop.query({
        allLevels: {
            __args: {
                condition: {
                    fileHash
                }
            },
            nodes: nodes ?? {
                id: true,
                name: true
            }
        }
    });
    return response.allLevels?.nodes[0];
};

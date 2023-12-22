import { zworpshop } from '@zeepkist/graphql'
import { LevelGenqlSelection } from '@zeepkist/graphql/zworpshop'

export const getLevel = async (
  fileHash: string,
  nodes?: LevelGenqlSelection
) => {
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
  })

  return response.allLevels?.nodes[0]
}

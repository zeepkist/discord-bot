import { gtr } from '@zeepkist/graphql'
import { UserCondition, UserGenqlSelection } from '@zeepkist/graphql/gtr'

export const getUserByDiscordId = async (discordId: string) => {
  const users = await getUsers({
    nodes: {
      id: true
    },
    condition: {
      discordId
    }
  })

  return users?.nodes[0]
}

export const getUsers = async (options?: {
  nodes: UserGenqlSelection
  condition: UserCondition
}) => {
  const { nodes, condition } = options ?? {}

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
  })

  return response.allUsers
}

import test from 'ava'

import { inviteUrl } from './index.js'

const macro = test.macro((t, input: string, expected: string) =>
  t.is(input, expected)
)

test(
  'returns canary invite url',
  macro,
  inviteUrl,
  'https://discord.com/oauth2/authorize?client_id=1064354910612762674&permissions=0&scope=bot%20applications.commands'
)

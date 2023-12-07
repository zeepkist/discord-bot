// https://discord.com/developers/applications/1014233853147230308/bot

import { IS_PRODUCTION } from '../config/index.js'

const clientIdCanary = '1014233853147230308'
const clientIdProduction = '1064354910612762674'

const getLink = (clientId: string) =>
  `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=0&scope=bot%20applications.commands`

export const inviteUrl = getLink(
  IS_PRODUCTION ? clientIdProduction : clientIdCanary
)

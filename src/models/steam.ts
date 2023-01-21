export interface Player {
  steamid: string
  personaname: string
  profileurl: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  personastate: number
  communityvisibilitystate: number
  profilestate: number
  lastlogoff: number
  commentpermission: number
  //
  realname: string
  primaryclanid: string
  timecreated: number
  gameid: string
  gameserverip: string
  gameextrainfo: string
  loccountrycode: string
  locstatecode: string
  loccityid: number
}

export interface PlayerSummmary {
  response: {
    players: Player[]
  }
}

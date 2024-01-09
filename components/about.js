import { bold, hyperlink, inlineCode } from 'discord.js';
import { createEmbed } from '../utils/index.js';
export const embed = createEmbed('About');
const akane = '<@104736549081468928>';
const thundernerd = '<@217779716289986560>';
const spacer = '\n<:blank:1065818232734351390>';
const akaneKofiLink = hyperlink('Ko-fi/wopian', 'https://ko-fi.com/wopian');
const thundernerdKofiLink = hyperlink('Ko-fi/thundernerd', 'https://ko-fi.com/thundernerd');
const botGithubLink = hyperlink('GitHub', 'https://github.com/zeepkist/zeepkist-bot');
const zeepkistSteamLink = hyperlink('Zeepkist', 'https://store.steampowered.com/app/1440670');
const zeepkistRecordsLink = hyperlink('zeepki.st', 'https://zeepki.st');
const zeepkistSuperLeagueLink = hyperlink('Super League results', 'https://zeepki.st/super-league');
const modkistDownloadLink = hyperlink('Modkist (Zeepkist Mod Manager)', 'https://github.com/tnrd-org/ModkistRevamped/releases/latest/download/Modkist.-.Revamped.zip');
const gtrGithubLink = hyperlink('GitHub', 'https://github.com/tnrd-org');
const gtrApiLink = hyperlink('GTR API', 'https://graphql.zeepkist-gtr.com/graphiql');
const zworpshopApiLink = hyperlink('Zworpshop API', 'https://graphql.zworpshop.com/graphiql');
const zeepkistApiLink = hyperlink('zeepki.st API', 'https://zeepki.st/graphiql');
const steamApiLink = hyperlink('Steam API', 'https://developer.valvesoftware.com/wiki/Steam_Web_API');
const commands = [
    `${inlineCode('/leaderboard')} to view the GTR points leaderboard`,
    `${inlineCode('/level')} to get info about a level (or list of levels)`,
    `${inlineCode('/random')} to get a random Zeepkist level`,
    `${inlineCode('/records')} to see the most recent PBs and WRs`,
    `${inlineCode('/user')} to get stats about a user`
];
const commandsField = {
    inline: false,
    name: 'Commands',
    value: commands.join('\n') + spacer
};
const aboutBotField = {
    inline: false,
    name: 'About the Bot',
    value: `The bot is built by ${akane} and is open-source on ${botGithubLink}\n\nYou can support the development of the bot and ${zeepkistRecordsLink} on ${akaneKofiLink}${spacer}`
};
const aboutGtrField = {
    inline: false,
    name: 'About Zeepkist GTR',
    value: `Zeepkist GTR is a mod built by ${thundernerd} to add a global time ranking system to ${zeepkistSteamLink} and is open-source on ${gtrGithubLink}\n\nDownload the mod with ${modkistDownloadLink}\n\nYou can support the development of GTR, Zworpshop and Modkist on ${thundernerdKofiLink}`
};
embed.setDescription(`A Discord bot for ${zeepkistSteamLink} records (GTR PBs/WRs), ${zeepkistSuperLeagueLink} and playlist generation.\n\nAll data is provided by the ${gtrApiLink}, the ${zworpshopApiLink}, the ${zeepkistApiLink} and the ${steamApiLink}.\n\nThe bot is not affiliated with Steam and only uses the Steam API to get ${bold('public')} user information not provided by GTR. Data obtained from the Steam API is never stored.${spacer}`);
embed.addFields(commandsField, aboutBotField, aboutGtrField);

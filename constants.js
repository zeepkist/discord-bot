import { config } from 'dotenv';
config();
export const ZEEPKIST_URL = 'https://zeepki.st';
export const STEAM_URL = 'https://steamcommunity.com';
export const API_URL = 'https://api.zeepkist-gtr.com/';
export const STEAM_API_URL = 'https://api.steampowered.com/';
export const GITHUB_API_URL = 'https://api.github.com/';
export const IS_PRODUCTION = Boolean(process.env.ZEEPKIST_BOT_PRODUCTION);
export const PAGINATION_LIMIT = 10;

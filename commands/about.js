import { ActionRowBuilder, ApplicationCommandType, bold, ButtonBuilder, ButtonStyle, EmbedBuilder, hyperlink, inlineCode } from 'discord.js';
import { getReleases } from '../services/github.js';
import { inviteUrl } from '../utils/index.js';
export const about = {
    name: 'about',
    description: 'Useful information and how to support development',
    type: ApplicationCommandType.ChatInput,
    ephemeral: false,
    run: async (interaction) => {
        const commands = [
            `${bold(inlineCode('/about'))} to see this message again`,
            `${bold(inlineCode('/verify'))} to link your Steam account to Discord`,
            `${bold(inlineCode('/user'))} to get information about a user`,
            `${bold(inlineCode('/level'))} to get information about a level (or list levels)`,
            `${bold(inlineCode('/ranking'))} to get the world record leaderboard`,
            `${bold(inlineCode('/recent'))} to get the most recent personal best records`
        ];
        const embed = new EmbedBuilder()
            .setTitle('About')
            .setColor(0xff_92_00)
            .setDescription(`This is a bot to show live user times and rankings for ${hyperlink('Zeepkist', 'https://store.steampowered.com/app/1440670')}\n\nAll data is provided by the Zeepkist GTR API and the Steam API.\n\nThe bot is not affiliated with Steam and only uses the Steam API to get ${bold('public')} user information not provided by Zeepkist GTR. Data obtained from the Steam API is never stored by the bot.`)
            .addFields({
            name: 'Commands',
            value: commands.join('\n')
        }, {
            inline: true,
            name: 'About the Bot',
            value: `The discord bot is built by <@104736549081468928> and is open-source on ${hyperlink('GitHub', 'https://github.com/wopian/zeepkist-bot')}\n\nYou can support the development of the bot and their other open-source projects on ${hyperlink('Ko-fi/wopian', 'https://ko-fi.com/wopian')}`
        }, {
            inline: true,
            name: 'About Zeepkist GTR',
            value: `Zeepkist GTR is a mod built by <@217779716289986560> to add a global time ranking system to ${hyperlink('Zeepkist', 'https://store.steampowered.com/app/1440670')}\n\nYou can support the development of Zeepkist GTR on ${hyperlink('Ko-fi/thundernerd', 'https://ko-fi.com/thundernerd')}`
        })
            .setTimestamp()
            .setFooter({
            text: `Version 1`
        });
        const latestRelease = await getReleases();
        if (latestRelease.length > 0) {
            embed.setTimestamp(new Date(latestRelease[0].published_at));
            embed.setFooter({
                text: latestRelease[0].tag_name
            });
        }
        const buttons = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Invite the Bot')
                .setURL(inviteUrl),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Support the Bot')
                .setURL('https://ko-fi.com/wopian'),
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Support Zeepkist GTR')
                .setURL('https://ko-fi.com/thundernerd')
        ]);
        await interaction.editReply({
            embeds: [embed],
            components: [buttons]
        });
    }
};

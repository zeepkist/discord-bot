const clientIdCanary = '1014233853147230308';
const clientIdProduction = '1064354910612762674';
console.log(`Canary: https://discord.com/oauth2/authorize?client_id=${clientIdCanary}&permissions=0&scope=bot%20applications.commands`);
console.log(`Production: https://discord.com/oauth2/authorize?client_id=${clientIdProduction}&permissions=0&scope=bot%20applications.commands`);
export {};
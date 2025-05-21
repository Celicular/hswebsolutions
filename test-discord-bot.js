const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds] });

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const USER_ID = process.env.DISCORD_USER_ID;

if (!BOT_TOKEN || !USER_ID) {
  console.error('Missing DISCORD_BOT_TOKEN or DISCORD_USER_ID in environment variables.');
  process.exit(1);
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    const user = await client.users.fetch(USER_ID);
    await user.send('✅ Test message: Your Discord bot DM is working!');
    console.log('Message sent successfully!');
  } catch (err) {
    console.error('Failed to send DM:', err);
  } finally {
    client.destroy();
    process.exit(0);
  }
});

client.login(BOT_TOKEN); 
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: '.env.local' });

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const USER_ID = process.env.DISCORD_USER_ID;
const DM_MESSAGE = process.env.DM_MESSAGE || '🚀 This is a test DM from your bot!';

if (!BOT_TOKEN || !USER_ID) {
  console.error('Missing DISCORD_BOT_TOKEN or DISCORD_USER_ID in environment variables.');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    const user = await client.users.fetch(USER_ID);
    await user.send(DM_MESSAGE);
    console.log('✅ DM sent successfully!');
  } catch (err) {
    console.error('❌ Failed to send DM:', err);
  } finally {
    client.destroy();
    process.exit(0);
  }
});

client.login(BOT_TOKEN); 
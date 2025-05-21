const { Client, GatewayIntentBits } = require('discord.js');

async function sendDmWithBot({ userId, message }) {
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  if (!BOT_TOKEN || !userId) throw new Error('Missing bot token or user ID');

  const client = new Client({ intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds] });

  return new Promise((resolve, reject) => {
    client.once('ready', async () => {
      try {
        const user = await client.users.fetch(userId);
        await user.send(message);
        resolve('DM sent successfully!');
      } catch (err) {
        reject(err);
      } finally {
        client.destroy();
      }
    });
    client.login(BOT_TOKEN);
  });
}

module.exports = sendDmWithBot; 
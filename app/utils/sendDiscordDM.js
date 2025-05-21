require('dotenv').config({ path: '.env.local' });

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const USER_ID = process.env.DISCORD_USER_ID;
const DM_CHANNEL_ID = process.env.DISCORD_DM_CHANNEL_ID; // Optional

const headers = {
  'Authorization': `Bot ${BOT_TOKEN}`,
  'Content-Type': 'application/json'
};

async function getDmChannelId() {
  if (DM_CHANNEL_ID) return DM_CHANNEL_ID;
  const dmUrl = 'https://discord.com/api/v10/users/@me/channels';
  const payload = { recipient_id: USER_ID };
  const res = await fetch(dmUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Failed to open DM: ${await res.text()}`);
  }
  const data = await res.json();
  return data.id;
}

async function sendDiscordDM(content) {
  try {
    const channelId = await getDmChannelId();
    const messageUrl = `https://discord.com/api/v10/channels/${channelId}/messages`;
    const messagePayload = { content: content };
    const res = await fetch(messageUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(messagePayload)
    });
    if (res.ok) {
      console.log('✅ Message sent successfully!');
    } else {
      console.error('❌ Failed to send message:', await res.text());
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

module.exports = sendDiscordDM; 
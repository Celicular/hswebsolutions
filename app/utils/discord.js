/**
 * Utility function to send Discord direct messages using user token
 */

const sendDiscordNotification = async (data) => {
  try {
    const userToken = process.env.DISCORD_BOT_TOKEN;
    const userId = process.env.DISCORD_USER_ID;
    
    if (!userToken || !userId) {
      console.error('Discord configuration missing');
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const adminUrl = `${baseUrl}/admin/estimate-submissions/${data.submissionId}`;

    // Create DM channel
    const createDmResponse = await fetch(`https://discord.com/api/v10/users/@me/channels`, {
      method: 'POST',
      headers: {
        'Authorization': `${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient_id: userId
      })
    });

    if (!createDmResponse.ok) {
      throw new Error('Failed to create DM channel');
    }

    const dmChannel = await createDmResponse.json();

    // Send message to DM channel
    const messageContent = {
      embeds: [{
        title: '🚀 New Estimate Request Received!',
        color: 0x4CAF50,
        fields: [
          {
            name: 'Client Name',
            value: data.name,
            inline: true
          },
          {
            name: 'Business Name',
            value: data.businessName || 'N/A',
            inline: true
          },
          {
            name: 'Email',
            value: data.email,
            inline: true
          },
          {
            name: 'Budget Range',
            value: data.budget || 'N/A',
            inline: true
          },
          {
            name: 'Timeline',
            value: data.timeline || 'N/A',
            inline: true
          }
        ],
        url: adminUrl,
        timestamp: new Date().toISOString()
      }]
    };

    const sendMessageResponse = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageContent)
    });

    if (!sendMessageResponse.ok) {
      throw new Error('Failed to send Discord message');
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
};

export default sendDiscordNotification; 
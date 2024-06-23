const {
  SLACK_INCOMING_WEBHOOK_URL,
  SLACK_CHANNEL,
  SLACK_USERNAME,
  SLACK_EMOJI
} = process.env;

export const slack = async text => {

  const params = {
    channel: SLACK_CHANNEL,
    username: SLACK_USERNAME,
    text,
    icon_emoji: SLACK_EMOJI
  }

  try {
    const resp = await fetch(SLACK_INCOMING_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify(params)
    })

    if(resp.status !== 200) {
      throw new Error(`Failed to send message to Slack: ${resp.statusText}`)
    }

  } catch (error) {
    console.error({ error, params, url: SLACK_INCOMING_WEBHOOK_URL });
  }
};

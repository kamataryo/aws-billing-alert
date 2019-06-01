const axios = require('axios')

module.exports = text => {
  const slackArg = [
    process.env.SLACK_INCOMMING_WEBHOOK_URL,
    {
      channel: '#general',
      username: 'AWS請求bot',
      text,
      icon_emoji: ':ghost:'
    }
  ]
  try {
    await axios.post(...slackArg)
  } catch (error) {
    console.error({ error, slackArg })
  }
}

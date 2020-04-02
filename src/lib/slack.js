const axios = require("axios");
const {
  SLACK_INCOMMING_WEBHOOK_URL,
  SLACK_CHANNEL,
  SLACK_USERNAME,
  SLACK_EMOJI
} = process.env;

module.exports = async text => {
  const slackArg = [
    SLACK_INCOMMING_WEBHOOK_URL,
    {
      channel: SLACK_CHANNEL,
      username: SLACK_USERNAME,
      text,
      icon_emoji: SLACK_EMOJI
    }
  ];
  try {
    await axios.post(...slackArg);
  } catch (error) {
    console.error({ error, slackArg });
  }
};

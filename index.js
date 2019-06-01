const AWS = require('aws-sdk')
const axios = require('axios')

const CW = new AWS.CloudWatch({
  region: 'us-east-1',
  endpoint: 'https://monitoring.us-east-1.amazonaws.com'
})

const getParam = (startTime, endTime) => {
  return {
    StartTime: startTime,
    EndTime: endTime,
    MetricDataQueries: [
      {
        Id: 'billingMetrics',
        MetricStat: {
          Metric: {
            Namespace: 'AWS/Billing',
            MetricName: 'EstimatedCharges',
            Dimensions: [
              {
                Name: 'Currency',
                Value: 'USD'
              }
            ]
          },
          Period: 86400,
          Stat: 'Average'
        }
      }
    ]
  }
}

const hasExcessed = (cost1, cost0, thresholds) => {
  for (let threshold of thresholds) {
    if (cost1 >= threshold && cost0 < threshold) {
      return { excessed: true, threshold }
    }
  }
  return { excessed: false }
}

const thresholds = [5, 300, 1000]

module.exports.handler = async () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()
  let text = ''

  if (day === 1) {
    const start = new Date(year, month - 1, 1, 0, 0, 0)
    const end = new Date(year, month, 1, 0, 0, 0)
    const result = await CW.getMetricData(getParam(start, end)).promise()

    const cost = result.MetricDataResults.find(
      data => data.Id === 'billingMetrics'
    ).Values[0]
    text = `先月のAWS利用料は ${cost} USD でした。`
  } else {
    const start = new Date(year, month, 1, 0, 0, 0)
    const end = new Date(year, month, day, 0, 0, 0)
    const result = await CW.getMetricData(getParam(start, end)).promise()
    const [cost1, cost0] = result.MetricDataResults.find(
      data => data.Id === 'billingMetrics'
    ).Values
    const { excessed, threshold } = hasExcessed(cost1, cost0, thresholds)
    if (excessed) {
      text = `今月のAWS利用料が ${threshold} USD を超えました。`
    } else {
      return
    }
  }

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

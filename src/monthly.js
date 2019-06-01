const AWS = require('aws-sdk')
const cw = require('./lib/cw')
const slack = require('./lib/slack')

const CW = new AWS.CloudWatch({
  region: 'us-east-1',
  endpoint: 'https://monitoring.us-east-1.amazonaws.com'
})

module.exports.handler = async () => {
  const result = await cw()

  const cost = result.MetricDataResults.find(
    data => data.Id === 'billingMetrics'
  ).Values[0]

  slack(`先月のAWS利用料は ${cost} USD でした。`)
}

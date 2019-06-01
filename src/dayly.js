const AWS = require('aws-sdk')
const cw = require('./lib/cw')
const slack = require('./lib/slack')

const { COST_REPORT_THREASHOLDS } = process.env
const THREASHOLDS = COST_REPORT_THREASHOLDS.split(',').map(str => parseInt(str))

const hasExcessed = (cost1, cost0) => {
  for (let threshold of THREASHOLDS) {
    if (cost1 >= threshold && cost0 < threshold) {
      return { excessed: true, threshold }
    }
  }
  return { excessed: false }
}

module.exports.handler = async () => {
  const result = await cw()
  const [cost1, cost0] = result.MetricDataResults.find(
    data => data.Id === 'billingMetrics'
  ).Values
  const { excessed, threshold } = hasExcessed(cost1, cost0)
  if (excessed) {
    slack(`今月のAWS利用料が ${threshold} USD を超えました。`)
  }
}

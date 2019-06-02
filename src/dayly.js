const { format } = require('util')
const hasExcessed = require('./lib/has-exceeded')
const cw = require('./lib/cw')
const slack = require('./lib/slack')
const { MESSAGE_FOR_EXCESSIVE_USAGE } = process.env

module.exports.handler = async () => {
  const result = await cw()
  const [cost1, cost0] = result.MetricDataResults.find(
    data => data.Id === 'billingMetrics'
  ).Values
  const { excessed, threshold } = hasExcessed(cost1, cost0)
  if (excessed) {
    return await slack(
      format(MESSAGE_FOR_EXCESSIVE_USAGE, threshold.toString())
    )
  }
}

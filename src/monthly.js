const { format } = require("util");
const cw = require("./lib/cw");
const slack = require("./lib/slack");
const { MESSAGE_FOR_MONTHLY_REPORT } = process.env;

module.exports.handler = async () => {
  const result = await cw();

  const cost = result.MetricDataResults.find(
    data => data.Id === "billingMetrics"
  ).Values[0];

  return await slack(format(MESSAGE_FOR_MONTHLY_REPORT, cost.toPrecision(3)));
};

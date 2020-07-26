const { format } = require("util");
const { monthlyReport } = require("./lib/cw");
const slack = require("./lib/slack");

const { MESSAGE_FOR_MONTHLY_REPORT } = process.env;
const [, , exec] = process.argv;

module.exports.handler = async (event) => {
  const result = await monthlyReport();

  if (event.debug) {
    console.log(JSON.stringify({ cwReport: result }, null, 2));
  }

  const cost = result.MetricDataResults.find(
    (data) => data.Id === "billingMetrics"
  ).Values[0];

  return await slack(format(MESSAGE_FOR_MONTHLY_REPORT, cost.toPrecision(3)));
};

if (exec === "--exec" || exec === "-e") {
  module.exports.handler();
}

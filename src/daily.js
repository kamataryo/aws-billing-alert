const { format } = require("util");
const hasExcessed = require("./lib/has-exceeded");
const { dailyReport } = require("./lib/cw");
const slack = require("./lib/slack");

const { MESSAGE_FOR_EXCESSIVE_USAGE, COST_REPORT_THREASHOLDS } = process.env;
const [, , exec] = process.argv;
const localMode = exec === "--exec" || exec === "-e";

module.exports.handler = async (event) => {
  const result = await dailyReport();
  const { Values } = result.MetricDataResults.find(
    (data) => data.Id === "billingMetrics"
  );
  // cost values for yesterday and a day before yesterday
  const [cost1, cost0] = Values;
  const { excessed, threshold } = hasExcessed(cost1, cost0);

  if (localMode || event.debug) {
    console.log(
      JSON.stringify(
        {
          cwReport: result,
          excessed,
          COST_REPORT_THREASHOLDS,
        },
        null,
        2
      )
    );
  }

  if (excessed) {
    return await slack(
      format(MESSAGE_FOR_EXCESSIVE_USAGE, threshold.toString())
    );
  } else {
    console.log("no excessive usage");
    console.log({ cost1, cost0, COST_REPORT_THREASHOLDS });
  }
};

if (localMode) {
  module.exports.handler();
}

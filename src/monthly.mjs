import { format } from "util";
import { monthlyReport } from "./lib/cw.mjs";
import { slack } from "./lib/slack.mjs";

const { MESSAGE_FOR_MONTHLY_REPORT, MESSAGE_NO_COST_DATA } = process.env;

export const handler = async (event) => {
  const result = await monthlyReport();

  if (event.debug) {
    console.log(JSON.stringify({ cwReport: result }, null, 2));
  }

  const cost = result.MetricDataResults.find(
    (data) => data.Id === "billingMetrics"
  ).Values[0];

  if(!cost) {
    return await slack(MESSAGE_NO_COST_DATA)
  } else {
    return await slack(format(MESSAGE_FOR_MONTHLY_REPORT, cost.toPrecision(3)));
  }
};

const [, , exec] = process.argv;
if (exec === "--exec" || exec === "-e") {
  handler({ debug: true });
}

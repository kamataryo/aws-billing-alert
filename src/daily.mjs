import { format } from "util";
import { hasExceed } from "./lib/has-exceeded.mjs";
import { dailyReport } from "./lib/ce.mjs";
import { slack } from "./lib/slack.mjs";

const { MESSAGE_FOR_EXCESSIVE_USAGE, COST_REPORT_THRESHOLDS } = process.env;

export const handler = async (event) => {
  const result = await dailyReport();
  const { values } = result.ResultsByTime
    .map(result => (parseFloat(result.Total.BlendedCost.Amount)))
    .reduce((prev, value) => {
      const current = prev.current + value
      prev.values.push(current)
      prev.current = current
      return prev
    }, {
      values: [],
      current: 0,
    })

    const cost0 = values[values.length - 1]
    const cost1 = values[values.length - 2] || 0

  // cost values for yesterday and a day before yesterday
  const { exceed, threshold } = hasExceed(cost1, cost0);

  if (event.debug) {
    console.log(
      JSON.stringify(
        {
          cwReport: result,
          exceed,
          COST_REPORT_THRESHOLDS,
        },
        null,
        2
      )
    );
  }

  if (exceed) {
    return await slack(
      format(MESSAGE_FOR_EXCESSIVE_USAGE, threshold.toString())
    );
  } else {
    console.log("no excessive usage");
    console.log({ cost1, cost0, COST_REPORT_THRESHOLDS });
  }
};

const [, , exec] = process.argv;
if (exec === "--exec" || exec === "-e") {
  handler({ debug: true });
}

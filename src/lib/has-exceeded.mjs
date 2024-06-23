const { COST_REPORT_THRESHOLDS } = process.env;
const THRESHOLDS = COST_REPORT_THRESHOLDS.split(",").map(str =>
  parseFloat(str)
);

export const hasExceed = (cost1, cost0) => {
  for (let threshold of THRESHOLDS) {
    console.log(threshold);
    if (cost1 >= threshold && cost0 < threshold) {
      return { exceed: true, threshold };
    }
  }
  return { exceed: false };
};

const { COST_REPORT_THREASHOLDS } = process.env;
const THREASHOLDS = COST_REPORT_THREASHOLDS.split(",").map(str =>
  parseFloat(str)
);

const hasExcessed = (cost1, cost0) => {
  for (let threshold of THREASHOLDS) {
    console.log(threshold);
    if (cost1 >= threshold && cost0 < threshold) {
      return { excessed: true, threshold };
    }
  }
  return { excessed: false };
};

module.exports = hasExcessed;

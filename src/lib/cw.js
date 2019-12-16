const AWS = require("aws-sdk");

const cwParam = (startTime, endTime) => {
  return {
    StartTime: startTime,
    EndTime: endTime,
    MetricDataQueries: [
      {
        Id: "billingMetrics",
        MetricStat: {
          Metric: {
            Namespace: "AWS/Billing",
            MetricName: "EstimatedCharges",
            Dimensions: [
              {
                Name: "Currency",
                Value: "USD"
              }
            ]
          },
          Period: 86400,
          Stat: "Average"
        }
      }
    ]
  };
};

const CW = new AWS.CloudWatch({
  region: "us-east-1",
  endpoint: "https://monitoring.us-east-1.amazonaws.com"
});

module.exports = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  let text = "";

  const start = new Date(year, month - 1, 1, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0);

  return CW.getMetricData(cwParam(start, end)).promise();
};

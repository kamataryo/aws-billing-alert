import { CloudWatchClient, GetMetricDataCommand } from '@aws-sdk/client-cloudwatch';

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
                Value: "USD",
              },
            ],
          },
          Period: 86400,
          Stat: "Average",
        },
      },
    ],
  };
};

const client = new CloudWatchClient({
  region: "us-east-1",
  endpoint: "https://monitoring.us-east-1.amazonaws.com",
});


export const monthlyReport = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const start = new Date(year, month - 1, 1, 0, 0, 0);
  const end = new Date(year, month, 1, 0, 0, 0);

  const getMetricsDataCommand = new GetMetricDataCommand(cwParam(start, end));
  return client.send(getMetricsDataCommand);
};

export const dailyReport = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const start = new Date(year, month, 1, 0, 0, 0);
  const end = now;

  const getMetricsDataCommand = new GetMetricDataCommand(cwParam(start, end));
  return client.send(getMetricsDataCommand);
};

import { CostExplorerClient, GetCostAndUsageCommand } from "@aws-sdk/client-cost-explorer";

const ceParam = (startTime, endTime, Granularity) => {
  return {
    TimePeriod: {
      Start: startTime,
      End: endTime,
    },
    Granularity: Granularity,
    Metrics: ["BlendedCost"],
  };
 };

const client = new CostExplorerClient({ region: "us-east-1" });


export const monthlyReport = () => {
  const now = new Date();
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 9); // timezone shift
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 9);

  // 先月の月初から月末までのコストを取得
  const start = startOfPrevMonth.toISOString().split('T')[0];
  const end = endOfPrevMonth.toISOString().split('T')[0];

  const getCostAndUsageCommand = new GetCostAndUsageCommand(ceParam(start, end, "MONTHLY"));
  return client.send(getCostAndUsageCommand);
};

export const dailyReport = () => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 0, 9); // timezone shift
  const start = startOfCurrentMonth.toISOString().split('T')[0];
  const end = now.toISOString().split('T')[0];

  console.log({start, end})

  const getCostAndUsageCommand = new GetCostAndUsageCommand(ceParam(start, end, "DAILY"));
  return client.send(getCostAndUsageCommand);
};

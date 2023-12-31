import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ELODataPoint {
  date: string;
  elo: number;
}

interface EloHistoryChartProps {
  data: any;
}

const EloHistoryChart: React.FC<EloHistoryChartProps> = ({ data }) => {
  const massagedData =
    data.length > 0
      ? [
          {
            date: new Date(
              new Date(data[0].date).getTime() - 5 * 60000
            ).toISOString(),
            elo: 1500,
          },
          ...data.map((dataPoint: any) => ({
            date: dataPoint.date,
            elo: dataPoint.elo,
          })),
        ]
      : [];

  const minElo = Math.min(...data.map((d: ELODataPoint) => d.elo));
  const maxElo = Math.max(...data.map((d: ELODataPoint) => d.elo));

  const yAxisDomain = [minElo - 50, maxElo + 50];

  return (
    <LineChart width={600} height={300} data={massagedData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis domain={yAxisDomain} />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="elo"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
};

export default EloHistoryChart;

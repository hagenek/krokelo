import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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
        ].map((item) => ({
          date: new Date(item.date).toLocaleString('no-NO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          elo: item.elo,
        }))
      : [];

  console.log(massagedData);

  const minElo = Math.min(...data.map((d: ELODataPoint) => d.elo));
  const maxElo = Math.max(...data.map((d: ELODataPoint) => d.elo));

  const yAxisDomain = [minElo - 50, maxElo + 50];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={massagedData}>
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
    </ResponsiveContainer>
  );
};

export default EloHistoryChart;

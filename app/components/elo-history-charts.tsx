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
import {
  type ELOLog,
  type TeamELOLog,
  type TeamPlayerELOLog,
} from '@prisma/client';
import { BASE_ELO } from '~/utils/constants';

interface Props {
  data: ELOLog[] | TeamELOLog[] | TeamPlayerELOLog[];
}

export const EloHistoryChart = ({ data }: Props) => {
  const massagedData =
    data.length > 0
      ? [
          {
            date: new Date(
              new Date(data[0].date).getTime() - 5 * 60000
            ).toISOString(),
            elo: BASE_ELO,
          },
          ...data.map((dataPoint) => ({
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

  const minElo = Math.min(...data.map((d) => d.elo));
  const maxElo = Math.max(...data.map((d) => d.elo));

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

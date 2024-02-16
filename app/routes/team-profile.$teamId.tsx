import { TeamELOLog } from '@prisma/client';
import { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';

import EloHistoryChart from '~/components/elo-history-charts';

import {
  getTeamDetails,
  getTeamELOHistory,
  getTeams,
  Team,
} from '~/services/team-service';
import GenericSearchableDropdown from '~/ui/searchable-dropdown';

interface Opponent {
  name: string;
}

interface MatchSummary {
  id: number;
  date: string;
  winnerELO?: number;
  loserELO?: number;
  loser?: Opponent;
  winner?: Opponent;
}

interface TeamDetails {
  id: number;
  name: string;
  currentELO: number;
  previousELO: number | null;
  teamMatchesAsWinner: MatchSummary[];
  teamMatchesAsLoser: MatchSummary[];
  eloLogs: TeamELOLog[];
}

export function calculateWinPercentage(
  wins: number,
  totalMatches: number
): string {
  if (totalMatches === 0) return '0'; // Handling division by zero
  return ((wins / totalMatches) * 100).toFixed(2);
}

export const loader: LoaderFunction = async ({ params }) => {
  const teamId = parseInt(params.teamId || '0', 10);

  const teams = await getTeams();

  if (teamId < 1) {
    return { eloHistory: [], teamDetails: null, teams };
  }

  try {
    const eloHistory = await getTeamELOHistory(teamId);
    console.log('Fetching team details with id ' + teamId);
    const teamDetails = await getTeamDetails(teamId);
    console.log('teamdetails response: ', teamDetails);

    return { eloHistory, teamDetails, teams };
  } catch (error) {
    console.error('Failed to fetch team data:', error);
    throw new Response(`Internal Server Error: ${error?.toString()}`, {
      status: 500,
    });
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: 'SB1U Krok Champions - Teams' },
    { property: 'og:title', content: 'SB1U Krokinole Champions - Teams' },
    {
      name: 'description',
      content: 'List and stats of all the teams in Krok Champions.',
    },
  ];
};

interface LoaderData {
  eloHistory: TeamELOLog[];
  teamDetails: TeamDetails;
  teams: Team[];
}

export default function TeamProfile() {
  const { eloHistory, teamDetails, teams } = useLoaderData<LoaderData>();
  const [selectedTeam, setSelectedTeam] = useState<Jsonify<Team> | null>();

  const navigate = useNavigate();

  console.log('teams *** ', teams);

  if (!Array.isArray(teams)) {
    return <div>Laster...</div>;
  }

  const teamsRankedByELO = [...teams]?.sort(
    (t1, t2) => t1.currentELO - t2.currentELO
  );

  const handleTeamChange = (teamId: number) => {
    setSelectedTeam(teams.find((t) => t?.id === teamId) || null);
    navigate(`/team-profile/${teamId}`);
  };

  return (
    <div className="container w-full items-center justify-center p-4">
      <GenericSearchableDropdown
        items={teams.map((t) => ({ id: t.id, name: t.name }))}
        onItemSelect={handleTeamChange}
        placeholder={'Velg lag'}
      />

      {selectedTeam && selectedTeam.id > 0 && teamDetails && (
        <div>
          <ul className="container mb-2 mt-4 flex items-center justify-center space-y-2 rounded-lg bg-blue-100 p-4 text-center text-center text-lg text-black shadow-lg dark:bg-gray-700 dark:text-white">
            <div>
              {teamsRankedByELO.findIndex(
                (team) => team.id === selectedTeam?.id
              ) < 5 && (
                <span className="group">
                  <img
                    src="/img/medal.png"
                    alt="Medalje for topp 5 plassering"
                    className="mr-2 h-8 w-8"
                  />
                  <span
                    className="text-md absolute bottom-full left-1/2 hidden -translate-x-1/2 translate-y-1 transform
                    rounded bg-black px-2 py-1 pb-1 text-white opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100"
                  >
                    Medalje for topp 5 plassering
                  </span>
                </span>
              )}
            </div>
            <li>
              Rating lagspill:{' '}
              <span className="font-bold dark:text-green-200">
                {teamDetails.currentELO}
              </span>
            </li>
          </ul>
          <div className="container flex flex-col justify-center">
            <h2 className="mb-2 text-xl font-bold dark:text-green-200">
              Duellspill
            </h2>
            <table
              className="mb-2 table-auto rounded-lg bg-blue-100
             p-4 text-lg text-black shadow-lg dark:bg-gray-700 dark:text-white"
            >
              <thead>
                <tr className="text-md">
                  <th className="px-4 py-2"># kamper</th>
                  <th className="px-4 py-2"># seiere</th>
                  <th className="px-4 py-2"># tap</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-md">
                  <td className="border px-4 py-2">
                    {teamDetails.teamMatchesAsWinner?.length ??
                      0 + teamDetails.teamMatchesAsLoser?.length ??
                      0}
                  </td>
                  <td className="border px-4 py-2">
                    {teamDetails.teamMatchesAsWinner?.length ?? 0}
                  </td>
                  <td className="border px-4 py-2">
                    {teamDetails.teamMatchesAsLoser?.length ?? 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <EloHistoryChart data={eloHistory} />
          <p>
            Matches played:{' '}
            {(teamDetails.teamMatchesAsWinner?.length ?? 0) +
              (teamDetails.teamMatchesAsLoser?.length ?? 0)}
          </p>
          <p>Matches won: {teamDetails.teamMatchesAsWinner?.length ?? 0}</p>
          <p>Loss: {teamDetails.teamMatchesAsLoser?.length ?? 0}</p>
          <p>
            Win percentage:{' '}
            {calculateWinPercentage(
              teamDetails.teamMatchesAsWinner?.length ?? 0,
              teamDetails.teamMatchesAsWinner?.length +
                teamDetails.teamMatchesAsLoser?.length ?? 0
            )}
            %
          </p>
        </div>
      )}
    </div>
  );
}

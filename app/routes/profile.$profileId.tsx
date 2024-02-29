import { ELOLog, Player } from '@prisma/client';
import { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { useNavigate } from '@remix-run/react';

import EloHistoryChart from '~/components/elo-history-charts';
import {
  getPlayerDetails,
  getPlayerELOHistory,
  getPlayerTeamELOHistory,
  getPlayers,
} from '~/services/player-service';

import GenericSearchableDropdown from '~/ui/searchable-dropdown';
import { calculateWinPercentage } from '~/routes/team-profile.$teamId';

interface Opponent {
  name: string;
}

interface MatchSummary {
  id: number;
  date: string; // Assuming date is in ISO string format
  winnerELO?: number; // Present in matchesAsWinner
  loserELO?: number; // Present in matchesAsLoser
  loser?: Opponent; // Present in matchesAsWinner
  winner?: Opponent; // Present in matchesAsLoser
}

interface PlayerDetails {
  id: number;
  name: string;
  currentELO: number;
  currentTeamELO: number;
  previousELO: number | null;
  previousTeamELO: number | null;
  matchesAsWinner: MatchSummary[];
  matchesAsLoser: MatchSummary[];
  eloLogs: ELOLog[];
  teamEloLogs: ELOLog[];
}

export const loader: LoaderFunction = async ({ params }) => {
  const playerId = parseInt(params.profileId || '0', 10);

  const players = await getPlayers();

  if (playerId < 1) {
    return { eloHistory: [], playerDetails: {}, players };
  }

  try {
    const eloHistory = await getPlayerELOHistory(playerId);
    const playerDetails = await getPlayerDetails(playerId);
    const teamEloHistory = await getPlayerTeamELOHistory(playerId);

    return { eloHistory, playerDetails, players, teamEloHistory };
  } catch (error) {
    console.error('Failed to fetch player data:', error);
    throw new Response('Internal Server Error', { status: 500 });
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: 'SB1U Krok Champions' },
    {
      property: 'og:title',
      content: 'SB1U Krokinole Champions',
    },
    {
      name: 'description',
      content: 'Her kan du registrere resultater fra SB1U Krokinolekamper.',
    },
  ];
};

interface PlayerSummary {
  id: number;
  name: string;
}

interface LoaderData {
  eloHistory: ELOLog[];
  playerDetails: PlayerDetails;
  teamEloHistory: ELOLog[];
  players: Player[];
}

export default function Profile() {
  const { eloHistory, playerDetails, players, teamEloHistory } =
    useLoaderData<LoaderData>();
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSummary | null>(
    playerDetails ?? null
  );
  const navigate = useNavigate();

  if (!playerDetails || !players) {
    return <div>Loading...</div>;
  }

  // Conditionally render the player details based on whether a valid player is selected
  const isValidPlayerSelected = selectedPlayer && selectedPlayer.id > 0;

  const handlePlayerChange = (playerId: number) => {
    const player = players.find((p) => p.id === playerId);
    setSelectedPlayer(player || null);
    navigate(`/profile/${playerId}`);
  };

  if (!Array.isArray(eloHistory)) {
    return <div>Loading...</div>;
  }

  const playersRankedByELO = [...players].sort(
    (p1, p2) => p2.currentELO - p1.currentELO
  );

  const playersRankedByTeamELO = [...players].sort(
    (p1, p2) => p2.currentTeamELO - p1.currentTeamELO
  );

  const numberOfWins = playerDetails.matchesAsWinner?.length ?? 0;
  const numberOfLosses = playerDetails.matchesAsLoser?.length ?? 0;

  return (
    <div className="container h-screen p-2 ">
      <div className="flex-col items-center justify-center text-center">
        <GenericSearchableDropdown
          items={players}
          onItemSelect={handlePlayerChange}
          placeholder={'Velg spiller'}
        />

        {isValidPlayerSelected && playerDetails && (
          <div>
            <ul className="container mb-2 mt-4 flex-col items-center space-y-2 rounded-lg bg-blue-100 p-4 text-center text-lg text-black shadow-lg dark:bg-gray-700 dark:text-white">
              <li className="text-4xl">{playerDetails.name}</li>
              <li>
                Rating lagspill:{' '}
                <span className="font-bold dark:text-green-200">
                  {playerDetails.currentTeamELO}
                </span>
              </li>
              <li>
                Rating duellspill:{' '}
                <span className="font-bold dark:text-green-200">
                  {playerDetails.currentELO}
                </span>
              </li>
              <div className="grid gap-2 md:grid-cols-2">
                <li className="flex items-center justify-center space-x-2 text-center">
                  <span className="flex text-lg">
                    {playersRankedByELO.findIndex(
                      (player) => player.id === selectedPlayer?.id
                    ) < 5 && (
                      <div className="group">
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
                      </div>
                    )}
                    Rangering duellspill:{' '}
                    <span className="ml-2 font-bold dark:text-blue-200">
                      {playersRankedByELO.findIndex(
                        (player) => player.id === selectedPlayer?.id
                      ) + 1}{' '}
                      / {playersRankedByELO?.length}
                    </span>
                  </span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <span className="flex p-2 text-lg">
                    {playersRankedByTeamELO.findIndex(
                      (player) => player.id === selectedPlayer?.id
                    ) < 5 && (
                      <div className="group text-center">
                        <img
                          src="/img/medal.png"
                          alt="Medalje for topp 5 plassering"
                          className="mr-2 h-8 w-8"
                        />
                        <span className="text-md absolute bottom-full left-1/2 hidden -translate-x-1/2 translate-y-1 transform rounded bg-black px-2 py-1 pb-1 text-white opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100">
                          Medalje for topp 5 plassering
                        </span>
                      </div>
                    )}
                    Rangering lagspill:{' '}
                    <span className="ml-2 font-bold dark:text-blue-200">
                      {playersRankedByTeamELO.findIndex(
                        (player) => player.id === selectedPlayer?.id
                      ) + 1}{' '}
                      / {playersRankedByTeamELO?.length}
                    </span>
                  </span>
                </li>
              </div>
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
                      {numberOfWins + numberOfLosses}
                    </td>
                    <td className="border px-4 py-2">{numberOfWins}</td>
                    <td className="border px-4 py-2">{numberOfLosses}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {teamEloHistory?.length > 0 && (
              <>
                <h1 className="mb-4 text-xl font-bold">
                  {playerDetails.name} sin ELO-historikk i lagspill
                </h1>
                <EloHistoryChart data={teamEloHistory} />
              </>
            )}
            {eloHistory?.length > 0 && (
              <>
                <h1 className="mb-4 text-xl font-bold">
                  {playerDetails.name} sin ELO-historikk i duellspill
                </h1>
                <EloHistoryChart data={eloHistory} />
              </>
            )}
            <div className="grid gap-2 md:grid-cols-2">
              <p className="">Kamper spilt: {numberOfWins + numberOfLosses}</p>{' '}
              <p className="">Antall kamper vunnet: {numberOfWins}</p>{' '}
              <p className="">Tap: {numberOfLosses}</p>
              <p className="">
                Seiersprosent:{' '}
                {calculateWinPercentage(
                  numberOfWins,
                  numberOfWins + numberOfLosses
                )}
                %
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

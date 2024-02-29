import { type MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { Player, getPlayers } from '../services/player-service';
import GenericSearchableDropdown from '~/ui/searchable-dropdown';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';

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

export const loader = async () => {
  const players = await getPlayers();
  return { players };
};

const findPlayerWinStats = (
  player: Jsonify<Player>,
  playerToCompareTo: Jsonify<Player>
) => {
  const playerMatches = player.matchesAsWinner.concat(player.matchesAsLoser);

  const allMatchesBetweenPlayers = playerMatches.filter(
    (match) =>
      match.winnerId === playerToCompareTo.id ||
      match.loserId === playerToCompareTo.id
  );
  const matchesWonByPlayer = allMatchesBetweenPlayers.filter(
    (match) => match.winnerId === player.id
  );
  const numberOfMatches = allMatchesBetweenPlayers.length;
  const numberOfMatchesWonByPlayer = matchesWonByPlayer.length;
  const numberOfMatchesLostByPlayer =
    numberOfMatches - numberOfMatchesWonByPlayer;
  const winPercentage = (numberOfMatchesWonByPlayer / numberOfMatches) * 100;

  return {
    numberOfMatches,
    numberOfMatchesWonByPlayer,
    numberOfMatchesLostByPlayer,
    winPercentage,
  };
};

export default function Index() {
  const { players } = useLoaderData<typeof loader>();

  const [player1, setPlayer1] = useState<Jsonify<Player> | undefined>(
    undefined
  );
  const [player2, setPlayer2] = useState<Jsonify<Player> | undefined>(
    undefined
  );

  const handlePlayerChange = (
    playerId: number,
    setPlayer: React.Dispatch<React.SetStateAction<Jsonify<Player> | undefined>>
  ) => {
    const player = players.find((p) => p.id === playerId);
    setPlayer(player);
  };

  const player1WinStats =
    player1 && player2 ? findPlayerWinStats(player1, player2) : undefined;

  // TODO: migrate datamodel to include elo gains/loses (recalculate elo values?)
  return (
    <>
      <div className="flex">
        <GenericSearchableDropdown
          className="mt-4"
          items={players}
          onItemSelect={(playerId) => handlePlayerChange(playerId, setPlayer1)}
          placeholder={'Velg spiller 1'}
        />
        <GenericSearchableDropdown
          className="mt-4"
          items={players}
          onItemSelect={(playerId) => handlePlayerChange(playerId, setPlayer2)}
          placeholder={'Velg spiller 2'}
        />
      </div>

      {player1 && player2 && (
        <>
          <div className="container flex flex-col justify-center">
            <h2 className="mb-2 text-xl font-bold dark:text-green-200">
              Sammenligning {player1.name} vs {player2.name}
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
                  <th className="px-4 py-2"># overlegenhet</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-md">
                  <td className="border px-4 py-2">
                    {player1WinStats?.numberOfMatches}
                  </td>
                  <td className="border px-4 py-2">
                    {player1WinStats?.numberOfMatchesWonByPlayer}
                  </td>
                  <td className="border px-4 py-2">
                    {player1WinStats?.numberOfMatchesLostByPlayer}
                  </td>
                  <td className="border px-4 py-2">
                    {player1WinStats?.winPercentage
                      ? player1WinStats.winPercentage.toFixed(2)
                      : 0}
                    %
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

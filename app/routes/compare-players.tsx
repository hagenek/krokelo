// routes/index.tsx
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

const calculateEloExchangeBetweenPlayers = (
  player1: Jsonify<Player>,
  player2: Jsonify<Player>
) => {
  const player1Matches = player1.matchesAsWinner + player1.matchesAsLoser;
  const allMatchesBetweenPlayers = player1Matches.filter(
    (match) => match.winnerId === player2.id || match.loserId === player2.id
  );

  // const player1Elo = player1.eloLogs[player1Matches - 1].elo;
  // const player2Elo = player2.eloLogs[player2Matches - 1].elo;

  // return Math.abs(player1Elo - player2Elo);

  //   const matchEloIndex = enrichedPlayer.eloLogs.findIndex(
  //     (log) => match.id === log.matchId
  //   );
  //   // First match, no prior matches so must handle from base elo of 1500
  //   if (!matchEloIndex) {
  //     return Math.abs(enrichedPlayer.eloLogs[0].elo - 1500);
  //   }

  //   const currentMatchElo = enrichedPlayer.eloLogs[matchEloIndex].elo;
  //   const formerMatchElo = enrichedPlayer.eloLogs[matchEloIndex - 1].elo;

  //   return Math.abs(currentMatchElo - formerMatchElo);
};

const PlayerSection = ({ player }: { player: Jsonify<Player> }) => {
  return (
    <div className="rounded p-10">
      <h2>{player.name}</h2>
    </div>
  );
};

export default function Index() {
  const { players } = useLoaderData<typeof loader>();

  const [player1, setPlayer1] = useState<Jsonify<Player> | undefined>(
    undefined
  );
  const [player2, setPlayer2] = useState<Jsonify<Player> | undefined>(
    undefined
  );

  //const player1Matches = player1?.matchesAsWinner + player1?.matchesAsLoser;

  const handlePlayerChange = (
    playerId: number,
    setPlayer: React.Dispatch<React.SetStateAction<Jsonify<Player> | undefined>>
  ) => {
    const player = players.find((p) => p.id === playerId);
    setPlayer(player);
  };

  console.log('players', players);

  return (
    <>
      <h1>Sammenlign spillere</h1>
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
      <div className="flex justify-between">
        {player1 && player2 && (
          <>
            <PlayerSection player={player1} />
            <PlayerSection player={player2} />
          </>
        )}
      </div>
      <div>
        <h2>Sammenligning</h2>
        <div>
          <h3>Matches</h3>
        </div>
      </div>
    </>
  );
}

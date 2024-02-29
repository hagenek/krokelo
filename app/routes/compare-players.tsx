// routes/index.tsx
import { type MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import {Player, getPlayers, RecentMatch} from '../services/player-service';
import GenericSearchableDropdown from '~/ui/searchable-dropdown';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';
import { Player as PrismaPlayer} from "@prisma/client";

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

const getEloForPlayerAfterMatch = (
    player: PrismaPlayer,
    match: Jsonify<RecentMatch>,
    players: Jsonify<Player[]>
) => {
  const enrichedPlayer = players.find((p) => p.id === player.id);
  if (!enrichedPlayer) {
    console.error(`Player ${player.name} not found in enriched player list`);
    return 0;
  }

  const matchEloIndex = enrichedPlayer.eloLogs.findIndex(
      (log) => match.id === log.matchId
  );
  // No match played
  if (matchEloIndex === -1) {
    return 1500;
  }

  return enrichedPlayer.eloLogs[matchEloIndex].elo;
};

const calculateEloExchangeBetweenPlayers = (
  player1: Jsonify<Player>,
  player2: Jsonify<Player>
) => {
  const player1Matches = player1.matchesAsWinner.concat(player1.matchesAsLoser);
  const player2Matches = player2.matchesAsWinner.concat(player2.matchesAsLoser);
  console.log('player1Matches', player1Matches);
    console.log('player2Matches', player2Matches);
  const allMatchesBetweenPlayers = player1Matches.filter(
    (match) => match.winnerId === player2.id || match.loserId === player2.id
  );

  console.log(player1)

    console.log('allMatchesBetweenPlayers', allMatchesBetweenPlayers);
    ;

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
  console.log("difference", player2 && player1 ?calculateEloExchangeBetweenPlayers(player1, player2) : "no players selected")

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

import { ActionFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import {
  getPlayers,
  getRecent1v1Matches,
  revertLatestMatch,
  Player,
  RecentMatch,
  calculatePlayerWinStreak,
} from '~/services/player-service';
import { PageContainerStyling } from './team';
import { Player as PrismaPlayer } from '@prisma/client';
import { useState } from 'react';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';

export const loader = async () => {
  const players = await getPlayers();
  const recent1v1Matches = await getRecent1v1Matches(5);

  const playersWithWinStreak = players.map((player) => ({
    ...player,
    winStreak: calculatePlayerWinStreak(player),
  }));

  const lastMatchTime = new Date(recent1v1Matches[0]?.date);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const showRevertCard = lastMatchTime > fiveMinutesAgo;

  return { players: playersWithWinStreak, recent1v1Matches, showRevertCard };
};

export const action: ActionFunction = async () => {
  await revertLatestMatch();
  return null;
};

const calculateEloChangeFromMatch = (
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
  // First match, no prior matches so must handle from base elo of 1500
  if (!matchEloIndex) {
    return Math.abs(enrichedPlayer.eloLogs[0].elo - 1500);
  }

  const currentMatchElo = enrichedPlayer.eloLogs[matchEloIndex].elo;
  const formerMatchElo = enrichedPlayer.eloLogs[matchEloIndex - 1].elo;

  return Math.abs(currentMatchElo - formerMatchElo);
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

const DuelStats = () => {
  const { players, recent1v1Matches, showRevertCard } =
    useLoaderData<typeof loader>();
  const [matchConfirmed, setMatchConfirmed] = useState(false);

  const matchDate = new Date(recent1v1Matches[0]?.date);
  const formattedDate = matchDate.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={PageContainerStyling}>
      {showRevertCard && recent1v1Matches[0] && !matchConfirmed && (
        <div className="relative my-4 rounded bg-blue-100 p-4 dark:bg-gray-800">
          <div className="flex-col items-center justify-between md:flex-row">
            <div className="flex-col">
              <h3 className="mb-2 text-center text-lg font-bold md:text-left dark:text-white">
                Nylig spilt kamp
              </h3>
              <p className="text-center text-sm md:text-left dark:text-gray-400">
                Dato: {formattedDate}
              </p>
            </div>

            <div className="flex justify-center">
              <div className="mt-4 h-48 w-48 rounded-full bg-gray-300 md:mt-0 md:h-64 md:w-64 dark:bg-gray-500">
                <img
                  src="img/2v2win.png"
                  alt="2v2win"
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-1 justify-between">
              <div className="text-center md:text-left">
                <p className="text-bold text-base dark:text-gray-200">
                  {recent1v1Matches[0].winner.name}{' '}
                  <span className="text-sm">(Winner)</span>
                </p>
                <p className="text-sm dark:text-gray-400">
                  ELO: {recent1v1Matches[0].winnerELO}
                </p>
              </div>

              <div className="text-center md:text-right">
                <p className="text-bold text-uppercase text-base dark:text-gray-200">
                  {recent1v1Matches[0].loser.name}{' '}
                  <span className="text-sm">(Loser)</span>
                </p>
                <p className="text-sm dark:text-gray-400">
                  ELO: {recent1v1Matches[0].loserELO}
                </p>
              </div>
            </div>
          </div>

          <Form method="post" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="submit"
                className="rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-800"
              >
                Angre
              </button>

              <button
                onClick={() => setMatchConfirmed(true)}
                className="focus:shadow-outline transform rounded bg-blue-600 px-4 py-2 font-bold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Bekreft
              </button>
            </div>
          </Form>
        </div>
      )}

      <section className="my-4 md:p-8">
        <h2 className="mb-3 text-2xl font-bold dark:text-white">
          Nylige spilte kamper:
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="px-4 py-2 text-center">Dato</th>
                <th className="px-4 py-2 text-center">Vinner</th>
                <th className="px-4 py-2 text-center">Taper</th>
                <th className="px-4 py-2 text-center">ELO Info</th>
              </tr>
            </thead>
            <tbody>
              {recent1v1Matches.map((match) => (
                <tr
                  key={match.id}
                  className="border-b dark:border-gray-600 dark:bg-gray-900"
                >
                  <td className="px-4 py-2 dark:text-white">
                    {new Date(match.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 dark:text-white">
                    <span className="font-semibold">{match.winner.name}</span>
                  </td>
                  <td className="px-4 py-2 dark:text-white">
                    <span className="font-semibold">{match.loser.name}</span>
                  </td>
                  {/* winnerELO and loserELO may be unreliable and switch where one is valid and the other is not may be best to check elo history */}
                  <td className="w-1/2 px-4 py-2 sm:w-auto dark:text-white">
                    <span className="text-[#70C7AA]">
                      {getEloForPlayerAfterMatch(match.winner, match, players)}
                    </span>{' '}
                    (+
                    {calculateEloChangeFromMatch(match.winner, match, players)})
                    -
                    <span className="text-[#EC7B7C]">
                      {getEloForPlayerAfterMatch(match.loser, match, players)}
                    </span>{' '}
                    (-{calculateEloChangeFromMatch(match.loser, match, players)}
                    )
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold dark:text-white">
          Spillere:
        </h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 dark:text-white">Navn</th>
              <th className="px-4 py-2 dark:text-white">Seiere (&#128293;)</th>
              <th className="px-4 py-2 dark:text-white">Tap</th>
              <th className="px-4 py-2 dark:text-white">ELO</th>
            </tr>
          </thead>

          <tbody>
            {players
              .sort((a, b) => b.currentELO - a.currentELO)
              .filter(
                (a) => a.matchesAsWinner.length + a.matchesAsLoser.length > 3
              )
              .filter((a) => a.currentELO !== 1500)
              .map((player) => (
                <tr
                  key={player.id}
                  className="border-t text-lg dark:border-gray-700"
                >
                  <td className="px-4 py-2 font-semibold dark:text-white">
                    {player.name}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {`${player.matchesAsWinner.length}` +
                      (player.winStreak > 0 ? ` (${player.winStreak})` : '')}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {player.matchesAsLoser.length}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {player.currentELO}
                  </td>
                </tr>
              ))}
          </tbody>
          <tbody>
            <tr>
              <th colSpan={4} scope="col" className="pb-4">
                <span className="text-2xl font-semibold dark:text-white">
                  Spillere med få kamper:
                </span>
                <span className="pl-2 text-sm dark:text-gray-400">
                  (Mindre enn 4 kamper spilt)
                </span>
              </th>
            </tr>
            {players
              .sort((a, b) => b.currentELO - a.currentELO)
              .filter(
                (a) => a.matchesAsWinner.length + a.matchesAsLoser.length <= 3
              )
              .filter((a) => a.currentELO !== 1500)
              .map((player) => (
                <tr
                  key={player.id}
                  className="border-t text-lg dark:border-gray-700"
                >
                  <td className="px-4 py-2 font-semibold dark:text-white">
                    {player.name}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {`${player.matchesAsWinner.length}` +
                      (player.winStreak > 0 ? ` (${player.winStreak})` : '')}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {player.matchesAsLoser.length}
                  </td>
                  <td></td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default DuelStats;

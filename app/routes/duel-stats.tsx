import { ActionFunction } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import {
  getPlayers,
  getRecent1v1Matches,
  revertLatestMatch,
  Player,
  RecentMatch,
  calculatePlayerWinStreak,
} from '~/services/player-service';
import { PageContainerStyling } from './team-duel';
import { Player as PrismaPlayer } from '@prisma/client';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';

export const loader = async () => {
  const players = await getPlayers();
  const recent1v1Matches = await getRecent1v1Matches(5);

  const playersWithWinStreak = players.map((player) => ({
    ...player,
    winStreak: calculatePlayerWinStreak(player),
  }));

  return { players: playersWithWinStreak, recent1v1Matches };
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

const isLatestMatch = (idx: number) => idx === 0;

const isMatchLessThan5MinutesOld = (matchDate: string) => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return new Date(matchDate) > fiveMinutesAgo;
};

const getRowHighlightClass = (idx: number, matchDate: string) =>
  isLatestMatch(idx) && isMatchLessThan5MinutesOld(matchDate)
    ? 'bg-slate-100 dark:bg-gray-700'
    : '';

const DuelStats = () => {
  const fetcher = useFetcher();
  const { players, recent1v1Matches } = useLoaderData<typeof loader>();

  return (
    <div className={PageContainerStyling}>
      <section className="my-4 md:p-8">
        <h2 className="mb-3 text-2xl font-bold dark:text-white">
          Nylige kamper
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="px-4 py-2 text-center">Tidspunkt</th>
                <th className="px-4 py-2 text-center">Vinner</th>
                <th className="px-4 py-2 text-center">Taper</th>
                <th className="px-4 py-2 text-center">ELO Info</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recent1v1Matches.map((match, idx) => (
                <tr
                  key={match.id}
                  className={`border-b dark:border-gray-600 ${getRowHighlightClass(idx, match.date)}`}
                >
                  <td className="px-4 py-2 dark:text-white">
                    {new Date(match.date).toLocaleString('no-NO', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-2 dark:text-white">
                    <span className="font-semibold">{match.winner.name}</span>
                  </td>
                  <td className="px-4 py-2 dark:text-white">
                    <span className="font-semibold">{match.loser.name}</span>
                  </td>
                  {/* winnerELO and loserELO may be unreliable and switch where one is valid and the other is not may be best to check elo history */}
                  <td className="w-1/2 px-4 py-2 sm:w-auto dark:text-white">
                    <span className="font-medium text-[#00754E] dark:text-[#70C7AA]">
                      {getEloForPlayerAfterMatch(match.winner, match, players)}
                    </span>
                    {` (+${calculateEloChangeFromMatch(match.winner, match, players)}) `}
                    <span className="font-medium text-[#E44244] dark:text-[#EC7B7C]">
                      {getEloForPlayerAfterMatch(match.loser, match, players)}
                    </span>
                    {` (-${calculateEloChangeFromMatch(match.loser, match, players)})`}
                  </td>
                  <td className="px-4">
                    {isLatestMatch(idx) &&
                      isMatchLessThan5MinutesOld(match.date) && (
                        <button
                          onClick={() => fetcher.submit({}, { method: 'post' })}
                          className="rounded bg-blue-600 px-2 py-1 font-bold text-white hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-800"
                        >
                          Angre
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold dark:text-white">
          Spillere
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
              <th colSpan={4} scope="col" className="pb-4 pt-1">
                <span className="text-2xl font-semibold dark:text-white">
                  Spillere med få kamper
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

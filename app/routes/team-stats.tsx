import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { getPlayers } from '~/services/player-service';
import {
  getTeams,
  getMultiplePlayerTeamMatchStats,
  getRecentTeamMatches,
  TeamMatchDetails,
  revertLatestTeamMatch,
} from '~/services/team-service';

import { EnrichedPlayer, PageContainerStyling } from './team';
import { BlueBadge, GreenBadge, YellowBadge } from '~/ui/badges';
import { Team } from '@prisma/client';

const getBadgeForTeam = (teamId: number, teams: Team[]) => {
  const topThreeTeamIds = teams.slice(0, 3).map((team) => team.id);

  if (teamId === topThreeTeamIds[0]) return <YellowBadge>Rank 1</YellowBadge>;
  if (teamId === topThreeTeamIds[1]) return <GreenBadge>Rank 2</GreenBadge>;
  if (teamId === topThreeTeamIds[2]) return <BlueBadge>Rank 3</BlueBadge>;

  return null;
};

type TeamRouteData = {
  players: EnrichedPlayer[];
  teams: any[];
  recentMatches: TeamMatchDetails;
  showRevertCard: boolean;
};

export const loader: LoaderFunction = async () => {
  const players = await getPlayers();
  let teams = await getTeams();

  // Get IDs of all players
  const playerIds = players.map((player) => player.id);

  // Fetch team match stats for all players
  const teamMatchStats = await getMultiplePlayerTeamMatchStats(playerIds);

  teams = teams.sort((a, b) => b.currentELO - a.currentELO);

  // Add the stats to the players
  const playersWithStats = players.map((player) => ({
    ...player,
    teamStats: teamMatchStats[player.id] || {
      totalMatches: 0,
      wins: 0,
      losses: 0,
    },
  }));

  const recentMatches = await getRecentTeamMatches(5);

  return { players: playersWithStats, teams, recentMatches };
};

export const action: ActionFunction = async () => {
  revertLatestTeamMatch();
  return null;
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

export default function TeamStats() {
  const fetcher = useFetcher();
  const { players, teams, recentMatches } = useLoaderData<TeamRouteData>();

  if (teams.length === 0) {
    return (
      <div className="bg-blue-800 p-8 dark:bg-gray-500 dark:text-white">
        Ingen kamper spilt enda
      </div>
    );
  }

  return (
    <div className={PageContainerStyling}>
      <section className="my-4 md:p-4">
        <h2 className="mb-3 text-2xl font-bold dark:text-white">
          Nylige kamper
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="px-4 py-2">Tidspunkt</th>
                <th className="px-4 py-2">Vinnende Lag (ELO etter seier)</th>
                <th className="px-4 py-2">Tapende Lag (ELO etter tap)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentMatches.map((match, idx) => (
                <tr
                  key={match.date}
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
                    <div>{getBadgeForTeam(match.winner.teamId, teams)}</div>
                    <span className="mr-2 font-semibold">
                      {match.winner.teamName}
                    </span>
                    <span className="text-sm">(ELO: {match.winner.elo})</span>
                  </td>
                  <td className="px-4 py-2 dark:text-white">
                    <div>{getBadgeForTeam(match.loser.teamId, teams)}</div>
                    <span className="font-semibold">
                      {match.loser.teamName}
                    </span>{' '}
                    <span className="text-sm">(ELO: {match.loser.elo})</span>
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
      <div>
        <h2 className="m-2 mb-3 text-xl font-semibold dark:text-white">
          Lagranking
        </h2>
        <table className="mb min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-center dark:text-white">Rank</th>
              <th className="px-4 py-2 dark:text-white">Lagnavn</th>
              <th className="px-4 py-2 dark:text-white">Seire</th>
              <th className="px-4 py-2 dark:text-white">Tap</th>
              <th className="px-4 py-2 dark:text-white">ELO</th>
            </tr>
          </thead>

          <tbody>
            {teams
              .sort(
                (a: EnrichedPlayer, b: EnrichedPlayer) =>
                  b.currentELO - a.currentELO
              )
              .map((team: any, index) => (
                <tr
                  key={team.id}
                  className="border-t text-lg dark:border-gray-700"
                >
                  <td className="px-4 py-2 text-center dark:text-white">
                    <span className="rounded-full bg-indigo-500 px-2 py-1 text-white">
                      #{index + 1}
                    </span>
                  </td>
                  <td className="text-md px-4 py-2 font-semibold dark:text-white">
                    {team.players
                      .map((player: EnrichedPlayer) => player.name)
                      .join(' & ')}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {team.wins}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {team.losses}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {team.currentELO}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 flex-col justify-center text-center">
        <h2 className="m-2 mb-3 text-xl font-semibold dark:text-white">
          Individuell ranking ved lagspill top 5
        </h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 dark:text-white">Navn og Rank</th>
              <th className="px-4 py-2 dark:text-white">Seiere</th>
              <th className="px-4 py-2 dark:text-white">Tap</th>
              <th className="px-4 py-2 dark:text-white"># Kamper</th>
              <th className="px-4 py-2 dark:text-white">ELO</th>
            </tr>
          </thead>
          <tbody>
            {players
              .sort(
                (a: EnrichedPlayer, b: EnrichedPlayer) =>
                  b.currentTeamELO - a.currentTeamELO
              )
              .slice(0, 5)
              .map((player, index) => (
                <tr
                  key={player.id}
                  className="text-md border-t md:text-xl dark:border-gray-700"
                >
                  <td className="px-4 py-2 font-semibold dark:text-white">
                    #{index + 1} {player.name}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {player.teamStats.wins}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {player.teamStats.losses}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {player.teamStats.totalMatches}
                  </td>
                  <td className="px-4 py-2 text-center align-middle dark:text-white">
                    {player.currentTeamELO}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

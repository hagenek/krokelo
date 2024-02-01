import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
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
import { useState } from 'react';

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

  const lastMatchTime = new Date(recentMatches[0]?.date);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const showRevertCard = lastMatchTime > fiveMinutesAgo;

  return { players: playersWithStats, teams, recentMatches, showRevertCard };
};

export const action: ActionFunction = async () => {
  revertLatestTeamMatch();
  return null;
};

export default function TeamStats() {
  const { players, teams, recentMatches, showRevertCard } =
    useLoaderData<TeamRouteData>();

  const [matchConfirmed, setMatchConfirmed] = useState(false);

  if (teams.length === 0) {
    return (
      <div className="bg-blue-800 p-8 dark:bg-gray-500 dark:text-white">
        Ingen kamper spilt enda
      </div>
    );
  }

  const matchDate = new Date(recentMatches[0]?.date);
  const formattedDate = matchDate.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={PageContainerStyling}>
      {showRevertCard && recentMatches[0] && !matchConfirmed && (
        <div className="relative my-4 rounded bg-blue-100 p-4 dark:bg-gray-800">
          <div className="flex-col items-center justify-between md:flex-row">
            <div className="flex-col">
              <h3 className="mb-2 text-center text-lg font-bold md:text-left dark:text-white">
                Nylig Spilt Kamp
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
                  {recentMatches[0].winner.teamName}{' '}
                  <span className="text-sm">(Seier)</span>
                </p>
                <div>
                  {getBadgeForTeam(recentMatches[0].winner.teamId, teams)}
                </div>
                <p className="text-sm dark:text-gray-400">
                  ELO: {recentMatches[0].winner.elo}
                </p>
              </div>

              <div className="text-center md:text-right">
                <p className="text-bold text-uppercase text-base dark:text-gray-200">
                  {recentMatches[0].loser.teamName}{' '}
                  <span className="text-sm">(Tap)</span>
                </p>
                <div>
                  {getBadgeForTeam(recentMatches[0].loser.teamId, teams)}
                </div>
                <p className="text-sm dark:text-gray-400">
                  ELO: {recentMatches[0].loser.elo}
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

      <h1 className="p-4 text-3xl">Statistikk for lagspill</h1>
      <section className="my-4 md:p-4">
        <h2 className="mb-3 text-2xl font-bold dark:text-white">
          Nylige kamper
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2">Dato</th>
                <th className="px-4 py-2">Vinnende Lag (ELO etter seier)</th>
                <th className="px-4 py-2">Tapende Lag (ELO etter tap)</th>
              </tr>
            </thead>
            <tbody>
              {recentMatches.map((match) => (
                <tr
                  key={match.date}
                  className="border-b dark:border-gray-600 dark:bg-gray-900"
                >
                  <td className="px-4 py-2 dark:text-white">
                    {new Date(match.date).toLocaleDateString()}
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

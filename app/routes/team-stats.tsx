import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPlayers } from "~/services/playerService";
import {
  getTeams,
  getMultiplePlayerTeamMatchStats,
  getRecentTeamMatches,
  TeamMatchDetails,
} from "~/services/teamService";

import { EnrichedPlayer, PageContainerStyling } from "./team";
import { BlueBadge, GreenBadge, YellowBadge } from "~/ui/badges";
import { Team } from "@prisma/client";

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

export default function TeamStats() {
  const { players, teams, recentMatches } = useLoaderData<TeamRouteData>();

  return (
    <div className={PageContainerStyling}>
      <h1 className="text-3xl p-4">Statistikk for lagspill</h1>

      <section className="my-4 md:p-4">
        <h2 className="text-2xl font-bold mb-3 dark:text-white">
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
                    <span className="font-semibold mr-2">
                      {match.winner.teamName}
                    </span>
                    <span className="text-sm">(ELO: {match.winner.elo})</span>
                  </td>
                  <td className="px-4 py-2 dark:text-white">
                    <div>{getBadgeForTeam(match.loser.teamId, teams)}</div>
                    <span className="font-semibold">
                      {match.loser.teamName}
                    </span>{" "}
                    <span className="text-sm">(ELO: {match.loser.elo})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div>
        <h2 className="text-xl m-2 font-semibold mb-3 dark:text-white">
          Lagranking
        </h2>
        <table className="min-w-full table-auto mb">
          <thead>
            <tr>
              <th className="px-4 py-2 dark:text-white">Lagnavn</th>{" "}
              {/* Team Name */}
              <th className="px-4 py-2 dark:text-white">Seire</th> {/* Wins */}
              <th className="px-4 py-2 dark:text-white">Tap</th> {/* Losses */}
              {/* # Matches */}
              <th className="px-4 py-2 dark:text-white">ELO</th>
            </tr>
          </thead>
          <tbody>
            {teams
              .sort(
                (a: EnrichedPlayer, b: EnrichedPlayer) =>
                  b.currentELO - a.currentELO
              )
              .map((team: any) => (
                <tr
                  key={team.id}
                  className="border-t dark:border-gray-700 text-lg"
                >
                  <td className="px-4 py-2 text-md font-semibold dark:text-white">
                    {team.players
                      .map((player: EnrichedPlayer) => player.name)
                      .join(" & ")}
                  </td>
                  <td className="px-4 py-2 align-middle text-center dark:text-white">
                    {team.wins}
                  </td>
                  <td className="px-4 py-2 align-middle text-center dark:text-white">
                    {team.losses}
                  </td>
                  {/*                   <td className="px-4 py-2 align-middle text-center dark:text-white">
          {team.totalMatches}
        </td> */}
                  <td className="px-4 py-2 align-middle text-center dark:text-white">
                    {team.currentELO}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex-col justify-center text-center mt-12">
        <h2 className="text-xl m-2 font-semibold mb-3 dark:text-white">
          Individuell ranking ved lagspill top 3
        </h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 dark:text-white">Name</th>
              <th className="px-4 py-2 dark:text-white">Wins</th>
              <th className="px-4 py-2 dark:text-white">Losses</th>
              <th className="px-4 py-2 dark:text-white"># Matches</th>
              <th className="px-4 py-2 dark:text-white">ELO</th>
            </tr>
          </thead>
          <tbody>
            {players
              .sort(
                (a: EnrichedPlayer, b: EnrichedPlayer) =>
                  b.currentTeamELO - a.currentTeamELO
              )
              .slice(0, 3)
              .map((player) => (
                <tr
                  key={player.id}
                  className="border-t dark:border-gray-700 text-md md:text-xl"
                >
                  <td className="px-4 py-2 font-semibold dark:text-white">
                    {player.name}
                  </td>
                  <td className="px-4 py-2 align-middle text-center dark:text-white">
                    {player.teamStats.wins}
                  </td>
                  <td className="px-4 py-2 align-middle text-center dark:text-white">
                    {player.teamStats.losses}
                  </td>
                  <td className="px-4 py-2 align-middle text-center dark:text-white">
                    {player.teamStats.totalMatches}
                  </td>
                  <td className="px-4 py-2 align-middle text-center dark:text-white">
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

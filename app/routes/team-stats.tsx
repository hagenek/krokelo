import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPlayers } from "~/services/playerService";
import {
  getTeams,
  getMultiplePlayerTeamMatchStats,
} from "~/services/teamService";

import { EnrichedPlayer, TeamRouteData } from "./team";

export const loader: LoaderFunction = async () => {
  const players = await getPlayers();
  const teams = await getTeams();

  // Get IDs of all players
  const playerIds = players.map((player) => player.id);

  // Fetch team match stats for all players
  const teamMatchStats = await getMultiplePlayerTeamMatchStats(playerIds);

  // Add the stats to the players
  const playersWithStats = players.map((player) => ({
    ...player,
    teamStats: teamMatchStats[player.id] || {
      totalMatches: 0,
      wins: 0,
      losses: 0,
    },
  }));

  return { players: playersWithStats, teams };
};

export default function TeamStats() {
  const { players, teams } = useLoaderData<TeamRouteData>();

  return (
    <div>
      <h1 className="text-3xl">Statistikk for lagspill</h1>
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
              {/*               <th className="px-4 py-2 xs:hidden dark:text-white">
      Antall Kamper
    </th> */}{" "}
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

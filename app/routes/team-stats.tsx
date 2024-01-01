import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getPlayers } from "~/services/playerService";
import {
  getTeams,
  getMultiplePlayerTeamMatchStats,
  getRecentTeamMatches,
  TeamMatchDetails,
  revertLatestTeamMatch,
} from "~/services/teamService";

import { EnrichedPlayer, PageContainerStyling } from "./team";
import { BlueBadge, GreenBadge, YellowBadge } from "~/ui/badges";
import { Team } from "@prisma/client";
import { useState } from "react";

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

export const action: ActionFunction = async ({ request }) => {
  revertLatestTeamMatch();
  return null;
};

export default function TeamStats() {
  const { players, teams, recentMatches, showRevertCard } =
    useLoaderData<TeamRouteData>();
  if (teams.length === 0)
    return (
      <div className="dark:text-white p-8 bg-blue-800 dark:bg-gray-500">
        Ingen kamper spilt enda
      </div>
    );

  const [matchConfirmed, setMatchConfirmed] = useState(false);

  const matchDate = new Date(recentMatches[0]?.date);
  const formattedDate = matchDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={PageContainerStyling}>
      {showRevertCard && recentMatches[0] && !matchConfirmed && (
        <div className="bg-blue-100 p-4 rounded relative my-4 dark:bg-gray-800">
          <div className="flex-col md:flex-row justify-between items-center">
            <div className="flex-col">
              <h3 className="font-bold text-lg mb-2 dark:text-white text-center md:text-left">
                Nylig Spilt Kamp
              </h3>
              <p className="text-sm dark:text-gray-400 text-center md:text-left">
                Dato: {formattedDate}
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-48 h-48 mt-4 md:mt-0 md:w-64 md:h-64 bg-gray-300 rounded-full dark:bg-gray-500">
                <img
                  src="img/2v2win.png"
                  alt="2v2win"
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="flex-1 flex justify-between mt-4">
              <div className="text-center md:text-left">
                <p className="text-base text-bold dark:text-gray-200">
                  {recentMatches[0].winner.teamName}{" "}
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
                <p className="text-base text-bold text-uppercase dark:text-gray-200">
                  {recentMatches[0].loser.teamName}{" "}
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
            <div className="grid gap-4 grid-cols-2">
              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded dark:bg-purple-600 dark:hover:bg-purple-800"
              >
                Angre
              </button>

              <button
                onClick={() => setMatchConfirmed(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Bekreft
              </button>
            </div>
          </Form>
        </div>
      )}

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
              <th className="px-4 py-2 dark:text-white text-center">Rank</th>{" "}
              <th className="px-4 py-2 dark:text-white">Lagnavn</th>{" "}
              <th className="px-4 py-2 dark:text-white">Seire</th> {/* Wins */}
              <th className="px-4 py-2 dark:text-white">Tap</th> {/* Losses */}
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
                  className="border-t dark:border-gray-700 text-lg"
                >
                  <td className="px-4 py-2 text-center dark:text-white">
                    <span className="bg-indigo-500 text-white rounded-full px-2 py-1">
                      #{index + 1}
                    </span>
                  </td>
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
              <th className="px-4 py-2 dark:text-white">Name and Rank</th>
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
              .map((player, index) => (
                <tr
                  key={player.id}
                  className="border-t dark:border-gray-700 text-md md:text-xl"
                >
                  <td className="px-4 py-2 font-semibold dark:text-white">
                    #{index + 1} {player.name}
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

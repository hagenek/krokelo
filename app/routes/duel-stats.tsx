import React from "react";
import { getPlayers, getRecent1v1Matches } from "../services/player-service";
import { Match, Player } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { EnrichedPlayer, PageContainerStyling } from "./team";
import { Jsonify } from "@remix-run/server-runtime/dist/jsonify";

type ExtendedMatch = Match & {
  winner: Player;
  loser: Player;
};

type DuelStatsLoaderData = {
  players: EnrichedPlayer[];
  recent1v1Matches: ExtendedMatch[];
};

export const loader: LoaderFunction = async () => {
  const players = await getPlayers();
  const recent1v1Matches = await getRecent1v1Matches(5);
  return { players, recent1v1Matches };
};

const calculateEloChangeFromMatch = (player: Player, match: Jsonify<ExtendedMatch>, players: EnrichedPlayer[]) => {
    const enrichedPlayer = players.find((p) => p.id === player.id);
    if (!enrichedPlayer) {
      console.error(`Player ${player.name} not found in enriched player list`)
      return 0
    }

    const matchEloIndex = enrichedPlayer.eloLogs.findIndex((log) => match.id === log.matchId);
    // First match, no prior matches so must handle from base elo of 1500
    if (!matchEloIndex && player.previousELO) {
      return Math.abs(enrichedPlayer.currentELO - player.previousELO);
    }

    const previousElo = enrichedPlayer.eloLogs[matchEloIndex - 1].elo;

    return player.currentELO - previousElo;
}

const DuelStats = () => {
  const { players, recent1v1Matches } = useLoaderData<DuelStatsLoaderData>();
  return (
    <div className={PageContainerStyling}>
      <section className="my-4 md:p-8">
        <h2 className="text-2xl font-bold mb-3 dark:text-white">
          Recent Matches:
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
            <tr className="border-b dark:border-gray-600">
              <th className="px-4 py-2 text-center">Date</th>
              <th className="px-4 py-2 text-center">Winner</th>
              <th className="px-4 py-2 text-center">Loser</th>
              <th className="px-4 py-2 text-center">ELO Details</th>
            </tr>
            </thead>
            <tbody>
            {recent1v1Matches.map((match) => (
                <tr key={match.id} className="border-b dark:border-gray-600 dark:bg-gray-900">
                  <td className="px-4 py-2 dark:text-white">
                    {new Date(match.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 dark:text-white">
                    <span className="font-semibold">{match.winner.name}</span>
                  </td>
                  <td className="px-4 py-2 dark:text-white">
                    <span className="font-semibold">{match.loser.name}</span>
                  </td>
                  {/* Possible bug with winnerELO and loserELO as they seem switched up */}
                  <td className="px-4 py-2 dark:text-white sm:w-auto w-1/2">
                    <span
                        className="text-[#70C7AA]">{match.winner.currentELO}</span> (+{calculateEloChangeFromMatch(match.winner, match, players)})
                    -
                    <span
                        className="text-[#EC7B7C]">{match.loser.currentELO}</span> ({calculateEloChangeFromMatch(match.loser, match, players)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3 dark:text-white">
          Spillere:
        </h2>
        <table className="min-w-full table-auto">
          <thead>
          <tr>
            <th className="px-4 py-2 dark:text-white">Name</th>
            <th className="px-4 py-2 dark:text-white">Wins</th>
            <th className="px-4 py-2 dark:text-white">Losses</th>
            <th className="px-4 py-2 dark:text-white">ELO</th>
          </tr>
          </thead>

          <tbody>
          {players
              .sort((a, b) => b.currentELO - a.currentELO)
              .filter((a) => a.currentELO !== 1500)
              .map((player) => (
                  <tr
                      key={player.id}
                      className="border-t dark:border-gray-700 text-lg"
                  >
                    <td className="px-4 py-2 font-semibold dark:text-white">
                      {player.name}
                    </td>
                    <td className="px-4 py-2 align-middle text-center dark:text-white">
                      {player.matchesAsWinner.length}
                    </td>
                    <td className="px-4 py-2 align-middle text-center dark:text-white">
                      {player.matchesAsLoser.length}
                    </td>
                    <td className="px-4 py-2 align-middle text-center dark:text-white">
                      {player.currentELO}
                    </td>
                  </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default DuelStats;

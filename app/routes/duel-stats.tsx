import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import {
  getPlayers,
  getRecent1v1Matches,
  revertLatestMatch,
} from "~/services/player-service";
import { EnrichedPlayer, Match, PageContainerStyling } from "./team";
import { useState } from "react";
import { Jsonify } from "@remix-run/server-runtime/dist/jsonify";
import { Player } from "@prisma/client";

type ExtendedMatch = Match & {
  winner: Player;
  loser: Player;
};

type DuelStatsLoaderData = {
  players: EnrichedPlayer[];
  recent1v1Matches: ExtendedMatch[];
  showRevertCard: boolean;
};

export const loader: LoaderFunction = async () => {
  const players = await getPlayers();
  const recent1v1Matches = await getRecent1v1Matches(5);

  const lastMatchTime = new Date(recent1v1Matches[0]?.date);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const showRevertCard = lastMatchTime > fiveMinutesAgo;

  return { players, recent1v1Matches, showRevertCard };
};

export const action: ActionFunction = async ({ request }) => {
  await revertLatestMatch();
  return null;
};

const calculateEloChangeFromMatch = (
  player: Player,
  match: Jsonify<ExtendedMatch>,
  players: EnrichedPlayer[]
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
  player: Player,
  match: Jsonify<ExtendedMatch>,
  players: EnrichedPlayer[]
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
    useLoaderData<DuelStatsLoaderData>();
  const [matchConfirmed, setMatchConfirmed] = useState(false);

  const matchDate = new Date(recent1v1Matches[0]?.date);
  const formattedDate = matchDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={PageContainerStyling}>
      {showRevertCard && recent1v1Matches[0] && !matchConfirmed && (
        <div className="bg-blue-100 p-4 rounded relative my-4 dark:bg-gray-800">
          <div className="flex-col md:flex-row justify-between items-center">
            <div className="flex-col">
              <h3 className="font-bold text-lg mb-2 dark:text-white text-center md:text-left">
                Nylig spilt kamp
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
                  {recent1v1Matches[0].winner.name}{" "}
                  <span className="text-sm">(Winner)</span>
                </p>
                <p className="text-sm dark:text-gray-400">
                  ELO: {recent1v1Matches[0].winnerELO}
                </p>
              </div>

              <div className="text-center md:text-right">
                <p className="text-base text-bold text-uppercase dark:text-gray-200">
                  {recent1v1Matches[0].loser.name}{" "}
                  <span className="text-sm">(Loser)</span>
                </p>
                <p className="text-sm dark:text-gray-400">
                  ELO: {recent1v1Matches[0].loserELO}
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

      <section className="my-4 md:p-8">
        <h2 className="text-2xl font-bold mb-3 dark:text-white">
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
                  <td className="px-4 py-2 dark:text-white sm:w-auto w-1/2">
                    <span className="text-[#70C7AA]">
                      {getEloForPlayerAfterMatch(match.winner, match, players)}
                    </span>{" "}
                    (+
                    {calculateEloChangeFromMatch(match.winner, match, players)})
                    -
                    <span className="text-[#EC7B7C]">
                      {getEloForPlayerAfterMatch(match.loser, match, players)}
                    </span>{" "}
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
        <h2 className="text-2xl font-semibold mb-3 dark:text-white">
          Spillere:
        </h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 dark:text-white">Navn</th>
              <th className="px-4 py-2 dark:text-white">Seiere</th>
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

        <section className="mt-4">
          <h1>
            <span className="text-2xl font-semibold mb-3 dark:text-white">
              Spillere med få kamper:
            </span>
            <span className="text-sm dark:text-gray-400">
              (Mindre enn 4 kamper spilt)
            </span>
          </h1>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 dark:text-white">Navn</th>
                <th className="px-4 py-2 dark:text-white">Seiere</th>
                <th className="px-4 py-2 dark:text-white">Tap</th>
              </tr>
            </thead>

            <tbody>
              {players
                .sort((a, b) => b.currentELO - a.currentELO)
                .filter(
                  (a) => a.matchesAsWinner.length + a.matchesAsLoser.length <= 3
                )
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
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </section>
    </div>
  );
};

export default DuelStats;

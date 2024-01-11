import { ELOLog, Player } from "@prisma/client";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, ChangeEvent } from "react";
import { useNavigate } from "@remix-run/react";

import EloHistoryChart from "~/components/elo-history-charts";
import {
  getPlayerDetails,
  getPlayerELOHistory,
  getPlayerTeamELOHistory,
  getPlayers,
} from "~/services/player-service";
import { getTeamELOHistory } from "~/services/team-service";
import GenericSearchableDropdown from "~/ui/searchable-dropdown";
import { calculateWinPercentage } from "~/routes/team-profile.$teamId";

interface Opponent {
  name: string;
}

interface MatchSummary {
  id: number;
  date: string; // Assuming date is in ISO string format
  winnerELO?: number; // Present in matchesAsWinner
  loserELO?: number; // Present in matchesAsLoser
  loser?: Opponent; // Present in matchesAsWinner
  winner?: Opponent; // Present in matchesAsLoser
}

interface PlayerDetails {
  id: number;
  name: string;
  currentELO: number;
  currentTeamELO: number;
  previousELO: number | null;
  previousTeamELO: number | null;
  matchesAsWinner: MatchSummary[];
  matchesAsLoser: MatchSummary[];
  eloLogs: ELOLog[];
  teamEloLogs: ELOLog[];
}

export const loader: LoaderFunction = async ({ params }) => {
  const playerId = parseInt(params.profileId || "0", 10);

  const players = await getPlayers();

  if (playerId < 1) {
    return { eloHistory: [], playerDetails: {}, players };
  }

  try {
    const eloHistory = await getPlayerELOHistory(playerId);
    const playerDetails = await getPlayerDetails(playerId);
    const teamEloHistory = await getPlayerTeamELOHistory(playerId);

    return { eloHistory, playerDetails, players, teamEloHistory };
  } catch (error) {
    console.error("Failed to fetch player data:", error);
    throw new Response("Internal Server Error", { status: 500 });
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: "SB1U Krok Champions" },
    {
      property: "og:title",
      content: "SB1U Krokinole Champions",
    },
    {
      name: "description",
      content: "Her kan du registrere resultater fra SB1U Krokinolekamper.",
    },
  ];
};

interface PlayerSummary {
  id: number;
  name: string;
}

interface LoaderData {
  eloHistory: ELOLog[];
  playerDetails: PlayerDetails;
  teamEloHistory: ELOLog[];
  players: Player[];
}

export default function Profile() {
  const { eloHistory, playerDetails, players, teamEloHistory } =
    useLoaderData<LoaderData>();
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSummary | null>(
    playerDetails ?? null
  );
  const navigate = useNavigate();

  if (!playerDetails || !players) {
    return <div>Loading...</div>;
  }

  // Conditionally render the player details based on whether a valid player is selected
  const isValidPlayerSelected = selectedPlayer && selectedPlayer.id > 0;

  const handlePlayerChange = (playerId: number) => {
    const player = players.find((p) => p.id === playerId);
    setSelectedPlayer(player || null);
    navigate(`/profile/${playerId}`);
  };

  if (!Array.isArray(eloHistory)) {
    return <div>Loading...</div>;
  }

  const playersRankedByELO = [...players].sort((p1, p2) => p2.currentELO - p1.currentELO);

  const playersRankedByTeamELO = [...players].sort(
    (p1, p2) => p2.currentTeamELO - p1.currentTeamELO
  );

  const numberOfWins = playerDetails.matchesAsWinner?.length ?? 0
  const numberOfLosses = playerDetails.matchesAsLoser?.length ?? 0

  return (
    <div className="container h-screen p-2 ">
      <div className="flex-col items-center text-center justify-center">

        <GenericSearchableDropdown items={players} onItemSelect={handlePlayerChange} placeholder={"Velg spiller"} />

        {isValidPlayerSelected && playerDetails && (
          <div>
            <ul
              className="container mt-4 flex-col text-lg text-center items-center mb-2 space-y-2 bg-blue-100 dark:bg-gray-700 text-black dark:text-white p-4 rounded-lg shadow-lg"
            >
              <li className="text-4xl">{playerDetails.name}</li>
              <li>
                Rating lagspill:{" "}
                <span className="dark:text-green-200 font-bold">
                  {playerDetails.currentTeamELO}
                </span>
              </li>
              <li>
                Rating duellspill:{" "}
                <span className="dark:text-green-200 font-bold">
                  {playerDetails.currentELO}
                </span>
              </li>
              <div className="grid md:grid-cols-2 gap-2">
                <li className="flex items-center justify-center text-center space-x-2">
                  <span className="flex text-lg">
                    {playersRankedByELO.findIndex(
                      (player) => player.id === selectedPlayer?.id
                    ) < 5 && (
                      <div className="group">
                        <img
                          src="/img/medal.png"
                          alt="Medalje for topp 5 plassering"
                          className="w-8 h-8 mr-2"
                        />
                        <span
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-1 pb-1 opacity-0
                    group-hover:opacity-100 bg-black text-white text-md rounded px-2 py-1 transition-opacity duration-300 hidden group-hover:block"
                        >
                          Medalje for topp 5 plassering
                        </span>
                      </div>
                    )}
                    Rangering duellspill:{" "}
                    <span className="dark:text-blue-200 ml-2 font-bold">
                      {playersRankedByELO.findIndex(
                        (player) => player.id === selectedPlayer?.id
                      ) + 1}{" "}
                      / {playersRankedByELO?.length}
                    </span>
                  </span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <span className="flex p-2 text-lg">
                    {playersRankedByTeamELO.findIndex(
                      (player) => player.id === selectedPlayer?.id
                    ) < 5 && (
                      <div className="text-center group">
                        <img
                          src="/img/medal.png"
                          alt="Medalje for topp 5 plassering"
                          className="w-8 h-8 mr-2"
                        />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-1 pb-1 opacity-0 group-hover:opacity-100 bg-black text-white text-md rounded px-2 py-1 transition-opacity duration-300 hidden group-hover:block">
                          Medalje for topp 5 plassering
                        </span>
                      </div>
                    )}
                    Rangering lagspill:{" "}
                    <span className="dark:text-blue-200 ml-2 font-bold">
                      {playersRankedByTeamELO.findIndex(
                        (player) => player.id === selectedPlayer?.id
                      ) + 1}{" "}
                      / {playersRankedByTeamELO?.length}
                    </span>
                  </span>
                </li>
              </div>
            </ul>
            <div className="container flex justify-center flex-col">
              <h2 className="text-xl mb-2 dark:text-green-200 font-bold">
                Duellspill
              </h2>
              <table
                className="table-auto text-lg mb-2 bg-blue-100
             dark:bg-gray-700 text-black dark:text-white p-4 rounded-lg shadow-lg"
              >
                <thead>
                  <tr className="text-md">
                    <th className="px-4 py-2"># kamper</th>
                    <th className="px-4 py-2"># seiere</th>
                    <th className="px-4 py-2"># tap</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-md">
                    <td className="border px-4 py-2">
                      {numberOfWins +
                        numberOfLosses}
                    </td>
                    <td className="border px-4 py-2">
                      {numberOfWins}
                    </td>
                    <td className="border px-4 py-2">
                      {numberOfLosses}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h1 className="text-xl font-bold mb-4">
              Spillerens ELO i lagspill
            </h1>
            {teamEloHistory?.length > 0 && (
              <EloHistoryChart data={teamEloHistory} />
            )}
            <h1 className="text-xl font-bold mb-4">
              {playerDetails.name}'s ELO History
            </h1>
            <EloHistoryChart data={eloHistory} />
            <div className="grid md:grid-cols-2 gap-2">
              <p className="">
                Kamper spilt:{" "}
                {numberOfWins +
                  numberOfLosses}
              </p>{" "}
              <p className="">
                Antall kamper vunnet: {numberOfWins}
              </p>{" "}
              <p className="">Tap: {numberOfLosses}</p>
              <p className="">
                Seiersprosent:{" "}
                {calculateWinPercentage(numberOfWins, numberOfWins + numberOfLosses)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

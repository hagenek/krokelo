import { ELOLog } from "@prisma/client";
import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "@remix-run/react";
import * as Select from "@radix-ui/react-select";

import EloHistoryChart from "~/components/elo-history-charts";
import {
  getPlayerDetails,
  getPlayerELOHistory,
  getPlayerTeamELOHistory,
  getPlayers,
} from "~/services/playerService";

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
  players: PlayerSummary[]; // Array of all players for selection
}

export default function Profile() {
  const { eloHistory, playerDetails, players, teamEloHistory } =
    useLoaderData<LoaderData>();
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSummary | null>(
    playerDetails ?? null
  );

  const navigate = useNavigate();

  if (!Array.isArray(eloHistory)) {
    return <div>Loading...</div>; // or handle the error case
  }

  console.log({ players });

  const handlePlayerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log("Handling player change", event.target.value);
    const selectedPlayerId = parseInt(event.target.value, 10);
    setSelectedPlayer(players.find((p) => p.id === selectedPlayerId) || null);
    navigate(`/profile/${selectedPlayerId}`);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center p-4">
      <select
        onChange={handlePlayerChange}
        className="block mb-4 text-xl w-1/2 py-2 px-3 border 
        border-gray-300 bg-white rounded-md shadow-sm focus:outline-none 
        focus:ring-primary-500 focus:border-primary-500 
        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        defaultValue=""
      >
        <option
          className="flex text-center"
          value={playerDetails.id ?? null}
          disabled
        >
          Velg spiller
        </option>
        {players?.map((player) => (
          <option
            className="flex text-center"
            key={player.id}
            value={player.id}
          >
            {player.name}
          </option>
        ))}
      </select>

      {selectedPlayer && selectedPlayer.id > 0 && (
        <div>
          <h1 className="text-xl font-bold mb-4">Spillerens ELO i lagspill</h1>
          <EloHistoryChart data={teamEloHistory} />
          <h1 className="text-xl font-bold mb-4">
            {playerDetails.name}'s ELO History
          </h1>
          <EloHistoryChart data={eloHistory} />
          <div className="grid md:grid-cols-2 gap-2">
            <p className="">
              Kamper spilt:{" "}
              {playerDetails.matchesAsWinner.length +
                playerDetails.matchesAsLoser.length}
            </p>{" "}
            <p className="">
              Antall kamper vunnet: {playerDetails.matchesAsWinner.length}
            </p>{" "}
            <p className="">Tap: {playerDetails.matchesAsLoser.length}</p>
            <p className="">
              Seiersprosent:{" "}
              {(
                playerDetails.matchesAsWinner.length /
                (playerDetails.matchesAsLoser.length +
                  playerDetails.matchesAsWinner.length)
              )
                .toString()
                .slice(2) + "%"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

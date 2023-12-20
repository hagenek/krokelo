// routes/index.tsx
import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from "@remix-run/node";
import CreatableSelect from "react-select/creatable";
import { useLoaderData, Form, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { redirect } from "@remix-run/node";
import {
  calculateNewIndividualELOs,
  createPlayer,
  createTeam,
  getPlayers,
  updateAndLogELOs,
} from "../services/playerService";
import {
  TeamMatchStats,
  getMultiplePlayerTeamMatchStats,
  getTeams,
} from "../services/teamService";
import {
  findPlayerByName,
  recordTeamMatch,
  calculateNewTeamELOs,
} from "../services/playerService";

export type Match = {
  id: number;
  date: string;
  winnerId: number;
  loserId: number;
  winnerELO: number;
  loserELO: number;
  playerId: number | null;
};

type ELOLog = {
  id: number;
  playerId: number;
  elo: number;
  date: string;
};

export type Player = {
  id: number;
  name: string;
  currentELO: number;
  currentTeamELO: number;
  matchesAsWinner: Match[];
  matchesAsLoser: Match[];
  eloLogs: ELOLog[];
  teamStats: {
    totalMatches: number;
    wins: number;
    losses: number;
  };
};
type RouteData = {
  players: Player[];
  teams: any[];
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

export const action: ActionFunction = async ({ request }) => {
  console.log("Executing action function!");

  try {
    const formData = await request.formData();
    console.log("FOrmdata", formData);
    console.log("Form data received:", Object.fromEntries(formData));

    const {
      team1Player1: team1Player1Name,
      team1Player2: team1Player2Name,
      team2Player1: team2Player1Name,
      team2Player2: team2Player2Name,
      winner: winningTeam,
    } = Object.fromEntries(formData);

    const allPlayerNames = [
      team1Player1Name,
      team1Player2Name,
      team2Player1Name,
      team2Player2Name,
    ];

    const uniqueNames = new Set(allPlayerNames);

    if (uniqueNames.size !== allPlayerNames.length) {
      console.error("A player cannot be on both teams.");
      // Handle the error appropriately, e.g., return an error message to the client
      return {
        error: "Each player must be unique and cannot be part of both teams.",
      };
    }

    if (
      typeof team1Player1Name === "string" &&
      typeof team1Player2Name === "string" &&
      typeof team2Player1Name === "string" &&
      typeof team2Player2Name === "string" &&
      typeof winningTeam === "string"
    ) {
      console.log(
        "Team player names:",
        team1Player1Name,
        team1Player2Name,
        team2Player1Name,
        team2Player2Name
      );
      console.log("Winning team:", winningTeam);

      const team1Player1 =
        (await findPlayerByName(team1Player1Name)) ||
        (await createPlayer(team1Player1Name));
      const team1Player2 =
        (await findPlayerByName(team1Player2Name)) ||
        (await createPlayer(team1Player2Name));

      const team2Player1 =
        (await findPlayerByName(team2Player1Name)) ||
        (await createPlayer(team2Player1Name));

      const team2Player2 =
        (await findPlayerByName(team2Player2Name)) ||
        (await createPlayer(team2Player2Name));

      // Create or find teams
      const team1 = await createTeam(team1Player1.id, team1Player2.id);
      const team2 = await createTeam(team2Player1.id, team2Player2.id);

      const team1IsWinner = winningTeam.trim().toLowerCase() === "team1";

      // Calculate new ELOs for each team
      const { newELOTeam1, newELOTeam2 } = calculateNewTeamELOs(
        team1.currentELO,
        team2.currentELO,
        team1IsWinner
      );

      const {
        newELOPlayer1Team1,
        newELOPlayer2Team1,
        newELOPlayer1Team2,
        newELOPlayer2Team2,
      } = calculateNewIndividualELOs(
        team1Player1.currentTeamELO,
        team1Player2.currentTeamELO,
        team2Player1.currentTeamELO,
        team2Player2.currentTeamELO,
        team1IsWinner
      );

      console.log(
        "New individual ELOs:",
        newELOPlayer1Team1,
        newELOPlayer2Team1,
        newELOPlayer1Team2,
        newELOPlayer2Team2
      );

      await updateAndLogELOs(
        team1.id,
        newELOTeam1,
        team2.id,
        newELOTeam2,
        team1Player1.id,
        newELOPlayer1Team1,
        team1Player2.id,
        newELOPlayer2Team1,
        team2Player1.id,
        newELOPlayer1Team2,
        team2Player2.id,
        newELOPlayer2Team2
      );
      // Determine winner and loser team IDs
      const winnerTeamId = team1IsWinner ? team1.id : team2.id;
      const loserTeamId = team1IsWinner ? team2.id : team1.id;
      console.log("Winner and loser team IDs:", winnerTeamId, loserTeamId);

      // Record team match
      await recordTeamMatch(
        winnerTeamId,
        loserTeamId,
        newELOTeam1,
        newELOTeam2
      );
    }
  } catch (error) {
    console.error("Error in action function:", error);
  }

  return redirect("/team");
};

export default function Index() {
  const { players, teams } = useLoaderData<RouteData>();

  const fetcher = useFetcher();

  const [team1Player1, setTeam1Player1] = useState("");
  const [team1Player2, setTeam1Player2] = useState("");
  const [team2Player1, setTeam2Player1] = useState("");
  const [team2Player2, setTeam2Player2] = useState("");
  const [winner, setWinner] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Simple validation
    if (
      !team1Player1 ||
      !team1Player2 ||
      !team2Player1 ||
      !team2Player2 ||
      !winner
    ) {
      alert("All fields are required!");
      return;
    }

    // Use the fetcher form to submit
    fetcher.submit(
      { team1Player1, team1Player2, team2Player1, team2Player2, winner },
      { method: "post" }
    );

    // Reset form fields
    setTeam1Player1("");
    setTeam1Player2("");
    setTeam2Player1("");
    setTeam2Player2("");
    setWinner("");
  };

  const playerOptions = players.map((player) => ({
    value: player.name,
    label: player.name,
  }));

  const handleTeam1Player1Change = (newValue: any) => {
    setTeam1Player1(newValue ? newValue.value : "");
  };

  const handleTeam1Player2Change = (newValue: any) => {
    setTeam1Player2(newValue ? newValue.value : "");
  };

  const handleTeam2Player1Change = (newValue: any) => {
    setTeam2Player1(newValue ? newValue.value : "");
  };

  const handleTeam2Player2Change = (newValue: any) => {
    setTeam2Player2(newValue ? newValue.value : "");
  };

  return (
    <div className="flex flex-col justify-center items-center dark:bg-gray-800 dark:text-white mx-auto">
      <div className="flex-col justify-center">
        <div className="flex-col items-center text-center justify-center">
          <h1 className="text-3xl">2v2</h1>
          <div className="flex justify-center mb-6">
            <img src="img/1v1krok.png" alt="1v1" className="w-1/3 rounded" />
          </div>
          <fetcher.Form method="post" onSubmit={handleSubmit} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Team 1 */}
              <div className="gap-2">
                <h3 className="block dark:text-white text-lg font-medium text-gray-700">
                  Lag 1
                </h3>
                <label
                  htmlFor="team1player1"
                  className="block dark:text-white text-sm font-medium text-gray-700"
                >
                  Spiller 1
                </label>
                <CreatableSelect
                  id="team1player1"
                  isClearable
                  onChange={handleTeam1Player1Change}
                  options={playerOptions}
                  className="mt-1 w-3/4 dark:text-black"
                  placeholder="Select or create Player 1 on Team 1"
                />
                <label
                  htmlFor="team1player2"
                  className="block text-sm dark:text-white font-medium text-gray-700"
                >
                  Spiller 2
                </label>
                <CreatableSelect
                  id="team1player2"
                  isClearable
                  onChange={handleTeam1Player2Change}
                  options={playerOptions}
                  className="mt-1 w-3/4 dark:text-black"
                  placeholder="Select or create Player 2 on Team 1"
                />
              </div>

              {/* Team 2 */}
              <div>
                <h3 className="block dark:text-white text-lg font-medium text-gray-700">
                  Lag 2
                </h3>
                <label
                  htmlFor="team2player1"
                  className="block dark:text-white text-sm font-medium text-gray-700"
                >
                  Spiller 1
                </label>
                <CreatableSelect
                  id="team2player1"
                  isClearable
                  onChange={handleTeam2Player1Change}
                  options={playerOptions}
                  className="mt-1 w-3/4 dark:text-black"
                  placeholder="Select or create Player 1 on Team 2"
                />
                <label
                  htmlFor="team2player2"
                  className="block text-sm dark:text-white font-medium text-gray-700"
                >
                  Spiller 2
                </label>
                <CreatableSelect
                  id="team2player2"
                  isClearable
                  onChange={handleTeam2Player2Change}
                  options={playerOptions}
                  className="mt-1 w-3/4 dark:text-black"
                  placeholder="Select or create Player 2 on Team 2"
                />
              </div>
            </div>

            <label
              htmlFor="winningTeam"
              className="block text-sm dark:text-white font-medium text-gray-700"
            >
              Hvem vant?
            </label>
            <select
              id="winningTeam"
              name="winningTeam"
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mb-4 md:w-auto focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Velg vinner</option>
              <option value="team1">Team 1</option>
              <option value="team2">Team 2</option>
            </select>

            <button
              type="submit"
              className="m-4 bg-blue-600 dark:bg-gray-400 dark:text-black hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white px-4 py-2 rounded"
            >
              Lagre resultat
            </button>
          </fetcher.Form>
        </div>

        <div>
          <h2 className="text-xl m-2 font-semibold mb-3 dark:text-white">
            Lagranking
          </h2>
          <table className="min-w-full table-auto mb">
            <thead>
              <tr>
                <th className="px-4 py-2 dark:text-white">Lagnavn</th>{" "}
                {/* Team Name */}
                <th className="px-4 py-2 dark:text-white">Seire</th>{" "}
                {/* Wins */}
                <th className="px-4 py-2 dark:text-white">Tap</th>{" "}
                {/* Losses */}
                {/*               <th className="px-4 py-2 xs:hidden dark:text-white">
                Antall Kamper
              </th> */}{" "}
                {/* # Matches */}
                <th className="px-4 py-2 dark:text-white">ELO</th>
              </tr>
            </thead>
            <tbody>
              {teams
                .sort((a, b) => b.currentELO - a.currentELO)
                .map((team: any) => (
                  <tr
                    key={team.id}
                    className="border-t dark:border-gray-700 text-lg"
                  >
                    <td className="px-4 py-2 text-md font-semibold dark:text-white">
                      {team.players
                        .map((player: Player) => player.name)
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
                .sort((a, b) => b.currentTeamELO - a.currentTeamELO)
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
    </div>
  );
}

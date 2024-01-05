// routes/index.tsx
import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from "@remix-run/node";
import CreatableSelect from "react-select/creatable";
import { useLoaderData, Form, useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { redirect } from "@remix-run/node";
import {
  calculateNewIndividualELOs,
  createPlayer,
  createTeam,
  getPlayers,
} from "../services/player-service";
import {
  TeamMatchStats,
  getMultiplePlayerTeamMatchStats,
  getTeams,
  recordTeamMatch,
  updateAndLogELOsTeamPlay,
} from "../services/team-service";
import {
  findPlayerByName,
  calculateNewTeamELOs,
} from "../services/player-service";
import Select from "react-select";

export type Match = {
  id: number;
  date: string;
  winnerId: number;
  loserId: number;
  winnerELO: number;
  loserELO: number;
  playerId: number | null;
};

export const PageContainerStyling =
  "flex-col rounded-3xl justify-center items-center dark:bg-gray-800 dark:text-white mx-auto";

type ELOLog = {
  id: number;
  playerId: number;
  elo: number;
  date: string;
};

export type EnrichedPlayer = {
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

type TeamRouteData = {
  players: EnrichedPlayer[];
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
      // Determine winner and loser team IDs
      const winnerTeamId = team1IsWinner ? team1.id : team2.id;
      const loserTeamId = team1IsWinner ? team2.id : team1.id;
      console.log("Winner and loser team IDs:", winnerTeamId, loserTeamId);

      // Record team match
      const match = await recordTeamMatch(
        winnerTeamId,
        loserTeamId,
        newELOTeam1,
        newELOTeam2
      );

      await updateAndLogELOsTeamPlay({
        teamData: {
          team1Id: team1.id,
          team2Id: team2.id,
          newELOTeam1: newELOTeam1,
          newELOTeam2: newELOTeam2,
        },
        playerData: {
          player1Id: team1Player1.id,
          player2Id: team1Player2.id,
          player3Id: team2Player1.id,
          player4Id: team2Player2.id,
          newELOPlayer1: newELOPlayer1Team1,
          newELOPlayer2: newELOPlayer2Team1,
          newELOPlayer3: newELOPlayer1Team2,
          newELOPlayer4: newELOPlayer2Team2,
        },
        matchId: match.id,
      });
    }
  } catch (error) {
    console.error("Error in action function:", error);
  }

  return redirect("/team-stats");
};

export default function Index() {
  const { players, teams } = useLoaderData<TeamRouteData>();
  const team1Player1Ref = useRef(null);
  const team1Player2Ref = useRef(null);
  const team2Player1Ref = useRef(null);
  const team2Player2Ref = useRef(null);

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

    const allPlayers = [team1Player1, team1Player2, team2Player1, team2Player2];
    const uniquePlayers = new Set(allPlayers);

    if (uniquePlayers.size !== allPlayers.length) {
      alert(
        "A player cannot be on both teams or duplicated within the same team."
      );
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

  const winnerOptions = [
    { value: "", label: "Velg vinner" },
    { value: "team1", label: `${team1Player1} & ${team1Player2}` }, // Assuming player1 and player2 are names
    { value: "team2", label: `${team2Player1} & ${team2Player2}` },
  ];

  const handleWinnerChange = (selectedOption: any) => {
    setWinner(selectedOption ? selectedOption.value : "");
  };

  return (
    <div className={PageContainerStyling}>
      <div className="flex-col justify-center p-4">
        <div className="flex-col items-center text-center justify-center">
          <div className="flex md:flex-col justify-center">
            <div className="text-4xl self-center md:text-3xl mb-2 md:mb-6 p-8 md:p-2">
              2 mot 2
            </div>
            <div className="flex self-center justify-center items-center w-1/3">
              <div className="md:items-center mb-6 ">
                <img src="img/2v2krok.png" alt="2v2" className="rounded" />
              </div>
            </div>
          </div>
          <fetcher.Form method="post" onSubmit={handleSubmit} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Team 1 */}
              <div className="gap-2 md:gap-6">
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
                  ref={team1Player1Ref}
                  onChange={handleTeam1Player1Change}
                  options={playerOptions}
                  className="mt-1 w-3/4 m-auto dark:text-black"
                  placeholder="Add P1 on Team 1"
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
                  ref={team1Player2Ref}
                  onChange={handleTeam1Player2Change}
                  options={playerOptions}
                  className="mt-1 w-3/4 m-auto dark:text-black"
                  placeholder="Add P2 on Team 1"
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
                  ref={team2Player1Ref}
                  onChange={handleTeam2Player1Change}
                  options={playerOptions}
                  className="mt-1 w-3/4 m-auto dark:text-black"
                  placeholder="Add P1 on Team 2"
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
                  ref={team2Player2Ref}
                  onChange={handleTeam2Player2Change}
                  options={playerOptions}
                  className="mt-1 w-3/4 m-auto dark:text-black"
                  placeholder="Add P2 on Team 2"
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="winningTeam"
                className="block text-sm dark:text-white font-medium text-gray-700"
              >
                Hvem vant?
              </label>

              <Select
                id="winner"
                name="winner"
                value={
                  winnerOptions.find((option) => option.value === winner) ||
                  null
                }
                onChange={handleWinnerChange}
                options={winnerOptions}
                className="mb-4 md:w-1/2 m-auto dark:text-black w-2/3"
                classNamePrefix="react-select"
              />
              <button
                type="submit"
                className="m-4 bg-blue-600 dark:bg-white dark:text-black hover:bg-blue-700 dark:hover:bg-gray-400 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white px-4 py-2 rounded"
              >
                Lagre resultat
              </button>
            </div>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}

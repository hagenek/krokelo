import { Player, TeamELOLog } from "@prisma/client";
import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "@remix-run/react";

import EloHistoryChart from "~/components/elo-history-charts";
import {
  getTeamDetails,
  getTeamELOHistory,
  getTeams,
} from "~/services/teamService";

interface Opponent {
  name: string;
}

interface MatchSummary {
  id: number;
  date: string;
  winnerELO?: number;
  loserELO?: number;
  loser?: Opponent;
  winner?: Opponent;
}

interface TeamDetails {
  id: number;
  name: string;
  currentELO: number;
  previousELO: number | null;
  teamMatchesAsWinner: MatchSummary[];
  teamMatchesAsLoser: MatchSummary[];
  eloLogs: TeamELOLog[];
}

export const loader: LoaderFunction = async ({ params }) => {
  const teamId = parseInt(params.teamId || "0", 10);

  const teams = await getTeams();

  if (teamId < 1) {
    return { eloHistory: [], teamDetails: null, teams };
  }

  try {
    const eloHistory = await getTeamELOHistory(teamId);
    console.log("Fetching team details with id " + teamId);
    const teamDetails = await getTeamDetails(teamId);
    console.log("teamdetails response: ", teamDetails);

    return { eloHistory, teamDetails, teams };
  } catch (error) {
    console.error("Failed to fetch team data:", error);
    throw new Response(`Internal Server Error: ${error?.toString()}`, {
      status: 500,
    });
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: "SB1U Krok Champions - Teams" },
    { property: "og:title", content: "SB1U Krokinole Champions - Teams" },
    {
      name: "description",
      content: "List and stats of all the teams in Krok Champions.",
    },
  ];
};

interface TeamSummary {
  id: number;
  name: string;
  players: {
    id: number;
    name: string;
  }[];
}

interface LoaderData {
  eloHistory: TeamELOLog[];
  teamDetails: TeamDetails;
  teams: TeamSummary[];
}

export default function TeamProfile() {
  const { eloHistory, teamDetails, teams } = useLoaderData<LoaderData>();
  const [selectedTeam, setSelectedTeam] = useState<TeamSummary | null>();

  const navigate = useNavigate();

  const handleTeamChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedTeamId = parseInt(event.target.value, 10);
    setSelectedTeam(teams.find((t) => t.id === selectedTeamId) || null);
    navigate(`/team-profile/${selectedTeamId}`);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center p-4">
      <select
        className="block mb-4 text-xl w-1/2 py-2 px-3 border 
        border-gray-300 bg-white rounded-md shadow-sm focus:outline-none 
        focus:ring-primary-500 focus:border-primary-500 
        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        onChange={handleTeamChange}
        defaultValue=""
      >
        <option className="flex text-center" value="" disabled>
          Select Team
        </option>
        {teams.map((team) => (
          <option className="flex text-center" key={team.id} value={team.id}>
            {team.players.map((p: any) => p.name).join(" & ")}
          </option>
        ))}
      </select>

      {selectedTeam && selectedTeam.id > 0 && teamDetails && (
        <div>
          <EloHistoryChart data={eloHistory} />
          <p>
            Matches played:{" "}
            {teamDetails.teamMatchesAsWinner.length +
              teamDetails.teamMatchesAsLoser.length}
          </p>
          <p>Matches won: {teamDetails.teamMatchesAsWinner.length}</p>
          <p>Loss: {teamDetails.teamMatchesAsLoser.length}</p>
          <p>
            Win percentage:{" "}
            {(teamDetails.teamMatchesAsWinner.length /
              (teamDetails.teamMatchesAsLoser.length +
                teamDetails.teamMatchesAsWinner.length)) *
              100}
            %
          </p>
        </div>
      )}
    </div>
  );
}

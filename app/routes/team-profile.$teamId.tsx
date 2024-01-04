import { Player, TeamELOLog } from "@prisma/client";
import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "@remix-run/react";

import EloHistoryChart from "~/components/elo-history-charts";

import {
  getTeamDetails,
  getTeamELOHistory,
  getTeams, GetTeamsResponse,
} from "~/services/team-service";
import GenericSearchableDropdown from "~/ui/searchable-dropdown";

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

interface LoaderData {
  eloHistory: TeamELOLog[];
  teamDetails: TeamDetails;
  teams: GetTeamsResponse;
}

export default function TeamProfile() {
  const { eloHistory, teamDetails, teams } = useLoaderData<LoaderData>();
  const [selectedTeam, setSelectedTeam] = useState<GetTeamsResponse | null>();

  const navigate = useNavigate();

  console.log("teams *** ", teams)

  if (!Array.isArray(teams)) {
    return <div>Laster...</div>;
  }

  const handleTeamChange = (teamId: number) => {
    setSelectedTeam(teams.find((t) => t?.id === teamId) || null);
    navigate(`/team-profile/${teamId}`);
  };

  return (
    <div className="container w-full items-center justify-center p-4">

      <GenericSearchableDropdown items={teams.map(t => ({id: t.id, name: t.name}))} onItemSelect={handleTeamChange} placeholder={"Velg lag"} />

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



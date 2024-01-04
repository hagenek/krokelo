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

  const teamsRankedByELO = [...teams]?.sort((t1, t2) => t1.currentELO - t2.currentELO)

  const handleTeamChange = (teamId: number) => {
    setSelectedTeam(teams.find((t) => t?.id === teamId) || null);
    navigate(`/team-profile/${teamId}`);
  };

  return (
    <div className="container w-full items-center justify-center p-4">

      <GenericSearchableDropdown items={teams.map(t => ({id: t.id, name: t.name}))} onItemSelect={handleTeamChange} placeholder={"Velg lag"} />

      {selectedTeam && selectedTeam.id > 0 && teamDetails && (
          <div>
            <ul
                className="container mt-4 text-center justify-center flex text-lg text-center items-center mb-2 space-y-2 bg-blue-100 dark:bg-gray-700 text-black dark:text-white p-4 rounded-lg shadow-lg"
            >
              <div>
              {teamsRankedByELO.findIndex(
                  (team) => team.id === selectedTeam?.id
              ) < 5 && (
                  <span className="group">
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
                  </span>
              )}
              </div>
              <li>
                Rating lagspill:{" "}
                <span className="dark:text-green-200 font-bold">
                  {teamDetails.currentELO}
                </span>
              </li>
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
                    {teamDetails.teamMatchesAsWinner?.length ?? 0 +
                        teamDetails.teamMatchesAsLoser?.length ?? 0}
                  </td>
                  <td className="border px-4 py-2">
                    {teamDetails.teamMatchesAsWinner?.length ?? 0}
                  </td>
                  <td className="border px-4 py-2">
                    {teamDetails.teamMatchesAsLoser?.length ?? 0}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <EloHistoryChart data={eloHistory}/>
            <p>
              Matches played:{" "}
              {teamDetails.teamMatchesAsWinner?.length ?? 0 +
                  teamDetails.teamMatchesAsLoser?.length ?? 0}
            </p>
            <p>Matches won: {teamDetails.teamMatchesAsWinner?.length ?? 0}</p>
            <p>Loss: {teamDetails.teamMatchesAsLoser?.length ?? 0}</p>
            <p>
              Win percentage:{" "}
              {(teamDetails.teamMatchesAsWinner?.length ?? 0 /
                      (teamDetails.teamMatchesAsLoser?.length ?? 0 +
                          teamDetails.teamMatchesAsWinner?.length ?? 0)) *
                  100}
              %
            </p>
          </div>
      )}
    </div>
  );
}



// routes/index.tsx
import type { MetaFunction, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { useEffect, useState } from 'react';
import { redirect } from "@remix-run/node";
import { calculateNewIndividualELOs, createPlayer, createTeam, getPlayers, updateAndLogELOs } from "../services/playerService";
import { calculateTeamLosses, calculateTeamWins, getTeams } from "../services/teamService";
import { recordMatch, updateELO, findPlayerByName, calculateNewELOs, recordTeamMatch, calculateNewTeamELOs } from '../services/playerService';

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

type Player = {
  id: number;
  name: string;
  currentELO: number;
  currentTeamELO: number;
  matchesAsWinner: Match[];
  matchesAsLoser: Match[];
  eloLogs: ELOLog[];
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
  return { players, teams };
};



export const action: ActionFunction = async ({ request }) => {
  console.log("Executing action function!");

  try {
    const formData = await request.formData();
    console.log('Form data received:', Object.fromEntries(formData));

    const team1Player1Name = formData.get('team1player1');
    const team1Player2Name = formData.get('team1player2');
    const team2Player1Name = formData.get('team2player1');
    const team2Player2Name = formData.get('team2player2');

    const allPlayerNames = [team1Player1Name, team1Player2Name, team2Player1Name, team2Player2Name];
    const uniqueNames = new Set(allPlayerNames);

    if (uniqueNames.size !== allPlayerNames.length) {
      console.error("A player cannot be on both teams.");
      // Handle the error appropriately, e.g., return an error message to the client
      return {
        error: "Each player must be unique and cannot be part of both teams."
      };
    }

    const winningTeam = formData.get('winningTeam'); // Field to indicate the winning team

    if (typeof team1Player1Name === 'string' && typeof team1Player2Name === 'string' &&
      typeof team2Player1Name === 'string' && typeof team2Player2Name === 'string' &&
      typeof winningTeam === 'string') {

      console.log('Team player names:', team1Player1Name, team1Player2Name, team2Player1Name, team2Player2Name);
      console.log('Winning team:', winningTeam);

      const team1Player1 = await findPlayerByName(team1Player1Name) || await createPlayer(team1Player1Name);
      const team1Player2 = await findPlayerByName(team1Player2Name) || await createPlayer(team1Player2Name);

      console.log('Team 1 players:', team1Player1, team1Player2);

      const team2Player1 = await findPlayerByName(team2Player1Name) || await createPlayer(team2Player1Name);
      const team2Player2 = await findPlayerByName(team2Player2Name) || await createPlayer(team2Player2Name);
      console.log('Team 2 players:', team2Player1, team2Player2);

      // Create or find teams
      const team1 = await createTeam(team1Player1.id, team1Player2.id);
      const team2 = await createTeam(team2Player1.id, team2Player2.id);
      console.log('Teams:', team1, team2);

      const team1IsWinner = winningTeam.trim().toLowerCase() === 'team1';
      console.log('Team 1 is winner:', team1IsWinner);

      console.log("Old ELOS", team1.currentELO, team2.currentELO)
      // Calculate new ELOs for each team
      const { newELOTeam1, newELOTeam2 } = calculateNewTeamELOs(team1.currentELO, team2.currentELO, team1IsWinner);
      console.log('New ELOs:', newELOTeam1, newELOTeam2);

      console.log("team1player1 currrent elo", team1Player1.currentELO)
      console.log("team1player2 currrent elo", team1Player2.currentELO)
      console.log("team2player1 currrent elo", team2Player1.currentELO)
      console.log("team2player2 currrent elo", team2Player2.currentELO)

      const { newELOPlayer1Team1, newELOPlayer2Team1, newELOPlayer1Team2, newELOPlayer2Team2 } = calculateNewIndividualELOs(
        team1Player1.currentTeamELO, team1Player2.currentTeamELO, team2Player1.currentTeamELO, team2Player2.currentTeamELO, team1IsWinner
      );

      console.log('New individual ELOs:', newELOPlayer1Team1, newELOPlayer2Team1, newELOPlayer1Team2, newELOPlayer2Team2);

      await updateAndLogELOs(
        team1.id, newELOTeam1,
        team2.id, newELOTeam2,
        team1Player1.id, newELOPlayer1Team1,
        team1Player2.id, newELOPlayer2Team1,
        team2Player1.id, newELOPlayer1Team2,
        team2Player2.id, newELOPlayer2Team2
      );
      // Determine winner and loser team IDs
      const winnerTeamId = team1IsWinner ? team1.id : team2.id;
      const loserTeamId = team1IsWinner ? team2.id : team1.id;
      console.log('Winner and loser team IDs:', winnerTeamId, loserTeamId);

      // Record team match
      await recordTeamMatch(winnerTeamId, loserTeamId, newELOTeam1, newELOTeam2);

      formData.set('team1player1', '');
      formData.set('team1player2', "");
      formData.set('team2player1', "");
      formData.set('team2player2', "");

    }
  } catch (error) {
    console.error('Error in action function:', error);
  }

  return redirect('/team');
};



export default function Index() {
  const { players, teams } = useLoaderData<RouteData>();

  const [team1Player1, setTeam1Player1] = useState("");
  const [team1Player2, setTeam1Player2] = useState("");
  const [team2Player1, setTeam2Player1] = useState("");
  const [team2Player2, setTeam2Player2] = useState("");
  const [winner, setWinner] = useState("");

  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    // Check if dark mode is set in localStorage
    let isDarkMode = false
    if (localStorage) {
      isDarkMode = localStorage.getItem('theme') === 'dark';
    }
    setDarkMode(isDarkMode);

    // Apply the appropriate class to the document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);


  const toggleDarkMode = () => {
    // Toggle dark mode state
    const newMode = !darkMode;
    setDarkMode(newMode);

    // Update localStorage and document class
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`container dark:bg-gray-800 dark:text-white mx-auto p-4 max-w-2xl`}>
      <div className="flex items-center justify-center mb-4">
        <span className="mr-2">Light</span>
        <button
          onClick={toggleDarkMode}
          className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <span
            className={`transform transition ease-in-out duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full`}
          />
        </button>
        <span className="ml-2">Dark</span>
      </div>
      <h1 className="text-4xl font-arial font-bold text-center mb-6 dark:text-white">SB1U Krokinole 2v2</h1>
      <div className="flex-col justify-center">
        <details className="mb-4">
          <summary className="dark:text-white">How to Use</summary>
          <div className="dark:text-gray-400">
            <h2 className="text-xl font-semibold mb-3 dark:text-white">How to use:</h2>
            <p className="mb-3">
              Enter the names of the players and select the winner. The ELOs will be updated automatically.
            </p>
            <p className="mb-3">
              If a player is not in the list, enter their name and submit the form. They will be added to the list and their ELO will be set to 1000.
            </p>
            <p className="mb-3">
              If you want to see the ELO history for a player, click on their name in the table below.
            </p>
          </div>
        </details>

        <div className="flex justify-center mb-6">
          <img src="img/2v2krok.png" alt="2v2" className="w-1/2 rounded" />
        </div>
        <Form method="post" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Team 1 */}
            <div>
              <h3 className="block dark:text-white text-sm font-medium text-gray-700">Team 1</h3>
              <label htmlFor="team1player1" className="block dark:text-white text-sm font-medium text-gray-700">Spiller 1</label>
              <input
                id="team1player1"
                type="text"
                name="team1player1"
                value={team1Player1}
                onChange={(e) => setTeam1Player1(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white mt-1"
                placeholder="Team 1 Player 1"
              />
              <label htmlFor="team1player2" className="block text-sm dark:text-white font-medium text-gray-700">Spiller 2</label>
              <input
                id="team1player2"
                type="text"
                name="team1player2"
                value={team1Player2}
                onChange={(e) => setTeam1Player2(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white mt-1"
                placeholder="Team 1 Player 2"
              />
            </div>

            {/* Team 2 */}
            <div>
              <h3 className="block dark:text-white text-sm font-medium text-gray-700">Team 2</h3>
              <label htmlFor="team2player1" className="block dark:text-white text-sm font-medium text-gray-700">Spiller 1</label>
              <input
                id="team2player1"
                type="text"
                name="team2player1"
                value={team2Player1}
                onChange={(e) => setTeam2Player1(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white mt-1"
                placeholder="Team 2 Player 1"
              />
              <label htmlFor="team2player2" className="block text-sm dark:text-white font-medium text-gray-700">Spiller 2</label>
              <input
                id="team2player2"
                type="text"
                name="team2player2"
                value={team2Player2}
                onChange={(e) => setTeam2Player2(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white mt-1"
                placeholder="Team 2 Player 2"
              />
            </div>
          </div>

          <label htmlFor="winningTeam" className="block text-sm dark:text-white font-medium text-gray-700">Hvem vant?</label>
          <select
            id="winningTeam"
            name="winningTeam"
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full md:w-auto focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Velg vinner</option>
            <option value="team1">Team 1</option>
            <option value="team2">Team 2</option>
          </select>

          <button
            type="submit"
            className="m-4 bg-blue-600 dark:bg-gray-400 dark:text-black hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white px-4 py-2 rounded">
            Lagre resultat
          </button>
        </Form>

        <table className="min-w-full table-auto mb">
          <thead>
            <tr>
              <th className="px-4 py-2 dark:text-white">Lagnavn</th> {/* Team Name */}
              <th className="px-4 py-2 dark:text-white">Seire</th> {/* Wins */}
              <th className="px-4 py-2 dark:text-white">Tap</th> {/* Losses */}
              <th className="px-4 py-2 dark:text-white">Antall Kamper</th> {/* # Matches */}
              <th className="px-4 py-2 dark:text-white">ELO</th> {/* ELO */}
            </tr>
          </thead>
          <tbody>
            {teams.sort((a, b) => b.currentELO - a.currentELO).map((team: any) => (
              <tr key={team.id} className="border-t dark:border-gray-700 text-xl">
                <td className="px-4 py-2 font-semibold dark:text-white">
                  {team.players.map((player: Player) => player.name).join(' & ')}
                </td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">
                  {team.wins}
                </td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">
                  {team.losses}
                </td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">
                  {team.totalMatches}
                </td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">
                  {team.currentELO}
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        <h2 className="text-2xl font-semibold mb-3 dark:text-white">Spillere:</h2>
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
            {players.sort((a, b) => b.currentTeamELO - a.currentTeamELO).map((player) => (
              <tr key={player.id} className="border-t dark:border-gray-700 text-xl">
                <td className="px-4 py-2 font-semibold dark:text-white">{player.name}</td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">{player.matchesAsWinner.length}</td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">{player.matchesAsLoser.length}</td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">{player.matchesAsLoser.length + player.matchesAsWinner.length}</td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">{player.currentTeamELO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

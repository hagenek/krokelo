// routes/index.tsx
import type { MetaFunction, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { useEffect, useState } from 'react';
import { createPlayer, getPlayers } from "../services/playerService";
import { recordMatch, updateELO, findPlayerByName, calculateNewELOs, logELO } from '../services/playerService';

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
  matchesAsWinner: Match[];
  matchesAsLoser: Match[];
  eloLogs: ELOLog[];
};
type RouteData = {
  players: Player[];
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
  return { players };
};


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const player1Name = formData.get('player1');
  const player2Name = formData.get('player2');
  const winner = formData.get('winner'); // Assuming you have a field to indicate the winner

  if (typeof player1Name === 'string' && typeof player2Name === 'string' && typeof winner === 'string') {
    const player1 = await findPlayerByName(player1Name) || await createPlayer(player1Name);
    const player2 = await findPlayerByName(player2Name) || await createPlayer(player2Name);


    const player1IsWinner = player1Name.trim().toLowerCase() === winner.trim().toLowerCase();
    const { newELOPlayer1, newELOPlayer2 } = calculateNewELOs(player1.currentELO, player2.currentELO, player1IsWinner);

    const winnerId = player1IsWinner ? player1.id : player2.id;
    const loserId = player1IsWinner ? player2.id : player1.id;

    await recordMatch(winnerId, loserId, newELOPlayer1, newELOPlayer2);
    await updateELO(player1.id, newELOPlayer1);
    await logELO(player1.id, newELOPlayer1); // Log the new ELO for player 1
    await updateELO(player2.id, newELOPlayer2);
    await logELO(player2.id, newELOPlayer2); // Log the new ELO for player 2

  }

  return null;
};



export default function Index() {
  const { players } = useLoaderData<RouteData>();
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
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

  const isFormValid = player1.trim() && player2.trim() && winner.trim();


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
      <h1 className="text-4xl font-arial font-bold text-center mb-6 dark:text-white">SB1U Krokinole Champions</h1>
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
          <img
            src="https://i.ibb.co/kB8pCL3/DALL-E-2023-12-14-13-12-01-Create-a-logo-for-a-Crokinole-match-recording-application-with-a-1960s-vi.png"
            alt="man-pushing-krokinole-stone-uphill"
            className="w-1/2 rounded"
          />
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
        value={team1player1}
        onChange={(e) => setTeam1Player1(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white mt-1"
        placeholder="Team 1 Player 1"
      />
      <label htmlFor="team1player2" className="block text-sm dark:text-white font-medium text-gray-700">Spiller 2</label>
      <input
        id="team1player2"
        type="text"
        name="team1player2"
        value={team1player2}
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
        value={team2player1}
        onChange={(e) => setTeam2Player1(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white mt-1"
        placeholder="Team 2 Player 1"
      />
      <label htmlFor="team2player2" className="block text-sm dark:text-white font-medium text-gray-700">Spiller 2</label>
      <input
        id="team2player2"
        type="text"
        name="team2player2"
        value={team2player2}
        onChange={(e) => setTeam2Player2(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white mt-1"
        placeholder="Team 2 Player 2"
      />
    </div>
  </div>

  <label htmlFor="winner" className="block text-sm dark:text-white font-medium text-gray-700">Hvem vant?</label>
  <select
    id="winner"
    name="winner"
    value={winner}
    onChange={(e) => setWinner(e.target.value)}
    className="border border-gray-300 rounded px-3 py-2 mb-4 w-full md:w-auto focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
  >
    <option value="">Velg vinner</option>
    <option value="team1">Team 1</option>
    <option value="team2">Team 2</option>
  </select>

  <button disabled={!isFormValid} // Disable the button if the form is not valid
    type="submit"
    className="m-4 bg-blue-600 dark:bg-gray-400 dark:text-black hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white px-4 py-2 rounded">
    Lagre resultat
  </button>
</Form>

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
            {players.sort((a, b) => b.currentELO - a.currentELO).map((player) => (
              <tr key={player.id} className="border-t dark:border-gray-700 text-xl">
                <td className="px-4 py-2 font-semibold dark:text-white">{player.name}</td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">{player.matchesAsWinner.length}</td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">{player.matchesAsLoser.length}</td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">{player.matchesAsLoser.length + player.matchesAsWinner.length}</td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">{player.currentELO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

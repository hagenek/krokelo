// routes/index.tsx
import type { MetaFunction, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { useState } from 'react';
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
    { title: "Very cool app | Remix" },
    {
      property: "og:title",
      content: "Very cool app",
    },
    {
      name: "description",
      content: "This app is the best",
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

  const toggleDarkMode = () => {
    if (localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'dark';
    }
  };

  return (
    <div className={`container dark:bg-gray-800 dark:text-white mx-auto p-4 max-w-2xl`}>
      <button onClick={toggleDarkMode} className="mb-4 p-2 bg-gray-200 dark:bg-gray-700 rounded">
        Toggle Dark Mode
      </button>
      <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">Krokinole ELO List</h1>
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
            className="w-1/2"
          />
        </div>
        <Form method="post" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="player1"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Player 1"
            />
            <input
              type="text"
              name="player2"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Player 2"
            />
          </div>
          <select
            name="winner"
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full md:w-auto focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select the Winner</option>
            <option value={player1}>{player1}</option>
            <option value={player2}>{player2}</option>
          </select>
          <button type="submit" className="m-4 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white px-4 py-2 rounded">
            Submit Result
          </button>
        </Form>
        <h2 className="text-2xl font-semibold mb-3 dark:text-white">Players:</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 dark:text-white">Name</th>
              <th className="px-4 py-2 dark:text-white">Wins</th>
              <th className="px-4 py-2 dark:text-white">ELO</th>
            </tr>
          </thead>
          <tbody>
            {players.sort((a, b) => b.currentELO - a.currentELO).map((player) => (
              <tr key={player.id} className="border-t dark:border-gray-700 text-xl">
                <td className="px-4 py-2 font-semibold dark:text-white">{player.name}</td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">{player.matchesAsWinner.length}</td>
                <td className="px-4 py-2 align-middle text-center dark:text-white">{player.currentELO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

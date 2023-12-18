// routes/index.tsx
import type { MetaFunction, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { useEffect, useState } from 'react';
import { createPlayer, getPlayers } from "../services/playerService";
import { recordMatch, updateELO, findPlayerByName, calculateNewELOs, logIndividualELO } from '../services/playerService';

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
    await logIndividualELO(player1.id, newELOPlayer1); // Log the new ELO for player 1
    await updateELO(player2.id, newELOPlayer2);
    await logIndividualELO(player2.id, newELOPlayer2); // Log the new ELO for player 2
    formData.set('player1', '');
    formData.set('player2', '');
    formData.set('winner', '');

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
        <button>1v1</button>
        <button>2v2</button>
      </div>
    </div>
  );
}

// routes/index.tsx
import type { MetaFunction, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
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

  const isFormValid = player1.trim() && player2.trim() && winner.trim();


  return (
    <div className={`container dark:bg-gray-800 dark:text-white mx-auto p-4 max-w-2xl`}>
      <div className="flex-col justify-center mb-8">
        <h1 className="text-4xl font-arial font-bold text-center mb-6 dark:text-white">SB1U Krokinole</h1>
        <div className="flex items-center justify-center">
          <img
            src="https://i.ibb.co/kB8pCL3/DALL-E-2023-12-14-13-12-01-Create-a-logo-for-a-Crokinole-match-recording-application-with-a-1960s-vi.png"
            alt="man-pushing-krokinole-stone-uphill"
            className="w-1/3 rounded"
          />
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/individual" className="dark:bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex flex-col items-center">
            <img src="img/1v1krok.png" alt="1v1" className="w-full rounded" />
            <span className="text-2xl dark:text-white text-gray-900 mt-2">1v1</span>
          </Link>
          <Link to="/team" className="dark:bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex flex-col items-center">
            <img src="img/2v2krok.png" alt="2v2" className="w-full rounded" />
            <span className="text-2xl mt-2 dark:text-white text-gray-900">2v2</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

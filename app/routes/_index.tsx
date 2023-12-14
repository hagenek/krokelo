// routes/index.tsx
import type { MetaFunction, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { useState } from 'react';
import { createPlayer, getPlayers } from "../services/playerService";
import { recordMatch, updateELO, findPlayerByName, calculateNewELOs } from '../services/playerService';


type Player = {
  id: number;
  name: string;
  wins: number;
  elo: number;
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

    const player1IsWinner = player1Name === winner;
    const { newELOPlayer1, newELOPlayer2 } = calculateNewELOs(player1.currentELO, player2.currentELO, player1IsWinner);

    await recordMatch(player1.id, player2.id, newELOPlayer1, newELOPlayer2);
    await updateELO(player1.id, newELOPlayer1);
    await updateELO(player2.id, newELOPlayer2);
  }

  return null;
};


export default function Index() {
  const { players } = useLoaderData<RouteData>();
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [winner, setWinner] = useState("");

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-6">Krokinole ELO List</h1>
      <img
        src="https://i.ibb.co/kB8pCL3/DALL-E-2023-12-14-13-12-01-Create-a-logo-for-a-Crokinole-match-recording-application-with-a-1960s-vi.png"
        alt="man-pushing-krokinole-stone-uphill"
        className="w-1/2"
        border="0"
      />
      <Form method="post" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="player1"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Player 1"
          />
          <input
            type="text"
            name="player2"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            placeholder="Player 2"
          />
        </div>
        <select
          name="winner"
          value={winner}
          onChange={(e) => setWinner(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full md:w-auto"
        >
          <option value="">Select the Winner</option>
          <option value={player1}>{player1}</option>
          <option value={player2}>{player2}</option>
        </select>
        <button type="submit" className="m-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Submit Result
        </button>
      </Form>
      <h2 className="text-xl font-semibold mb-3">Players:</h2>
      <ul className="list-disc list-inside">
        {players.map((player: Player) => (
          <li key={player.id} className="mb-2">
            <div className="font-semibold">{player.name}</div>
            <div className="text-sm text-gray-600">Wins: {player.wins}</div>
            <div className="text-sm text-gray-600">ELO: {player.elo}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

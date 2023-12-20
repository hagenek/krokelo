// routes/index.tsx
import type {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from "@remix-run/node";
import { useLoaderData, Form, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { createPlayer, getPlayers } from "../services/playerService";
import {
  recordMatch,
  updateELO,
  findPlayerByName,
  calculateNewELOs,
  logIndividualELO,
} from "../services/playerService";
import { Player } from "./team";
import CreatableSelect from "react-select/creatable";
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
  const player1Name = formData.get("player1");
  const player2Name = formData.get("player2");
  const winner = formData.get("winner"); // Assuming you have a field to indicate the winner

  if (
    typeof player1Name === "string" &&
    typeof player2Name === "string" &&
    typeof winner === "string"
  ) {
    const player1 =
      (await findPlayerByName(player1Name)) ||
      (await createPlayer(player1Name));

    const player2 =
      (await findPlayerByName(player2Name)) ||
      (await createPlayer(player2Name));

    const player1IsWinner =
      player1Name.trim().toLowerCase() === winner.trim().toLowerCase();

    const { newELOPlayer1, newELOPlayer2 } = calculateNewELOs(
      player1.currentELO,
      player2.currentELO,
      player1IsWinner
    );

    const winnerId = player1IsWinner ? player1.id : player2.id;
    const loserId = player1IsWinner ? player2.id : player1.id;

    await recordMatch(winnerId, loserId, newELOPlayer1, newELOPlayer2);
    await updateELO(player1.id, newELOPlayer1);
    await logIndividualELO(player1.id, newELOPlayer1); // Log the new ELO for player 1
    await updateELO(player2.id, newELOPlayer2);
    await logIndividualELO(player2.id, newELOPlayer2); // Log the new ELO for player 2
    formData.set("player1", "");
    formData.set("player2", "");
    formData.set("winner", "");
  }

  return null;
};

export default function Index() {
  const { players } = useLoaderData<RouteData>();
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [winner, setWinner] = useState("");

  const fetcher = useFetcher();

  const playerOptions = players.map((player) => ({
    value: player.name,
    label: player.name,
  }));

  const handlePlayer1Change = (newValue: any) => {
    setPlayer1(newValue ? newValue.value : "");
  };

  const handlePlayer2Change = (newValue: any) => {
    setPlayer2(newValue ? newValue.value : "");
  };

  const winnerOptions = [
    { value: "", label: "Velg vinner" },
    { value: player1, label: player1 }, // Assuming player1 and player2 are names
    { value: player2, label: player2 },
  ];

  const handleWinnerChange = (selectedOption: any) => {
    setWinner(selectedOption ? selectedOption.value : "");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Simple validation
    if (!player1 || !player2 || !winner) {
      alert("All fields are required!");
      return;
    }

    // Use the fetcher form to submit
    fetcher.submit({ player1, player2, winner }, { method: "post" });

    // Reset form fields
    setPlayer1("");
    setPlayer2("");
    setWinner("");
  };

  const isFormValid = player1.trim() && player2.trim() && winner.trim();

  return (
    <div
      className={`container dark:bg-gray-800 dark:text-white mx-auto p-4 max-w-2xl`}
    >
      <h1 className="text-4xl font-arial font-bold text-center mb-6 dark:text-white">
        1v1
      </h1>
      <div className="flex-col justify-center">
        <details className="mb-4">
          <summary className="dark:text-white">How to Use</summary>
          <div className="dark:text-gray-400">
            <h2 className="text-xl font-semibold mb-3 dark:text-white">
              How to use:
            </h2>
            <p className="mb-3">
              Enter the names of the players and select the winner. The ELOs
              will be updated automatically.
            </p>
            <p className="mb-3">
              If a player is not in the list, enter their name and submit the
              form. They will be added to the list and their ELO will be set to
              1000.
            </p>
            <p className="mb-3">
              If you want to see the ELO history for a player, click on their
              name in the table below.
            </p>
          </div>
        </details>

        <div className="flex justify-center mb-6">
          <img src="img/1v1krok.png" alt="1v1" className="w-1/3 rounded" />
        </div>
        <fetcher.Form method="post" onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 items-center md:grid-cols-2 gap-4 mb-4 ">
            <div>
              <label
                htmlFor="player1"
                className="block dark:text-white text-sm font-medium text-gray-700"
              >
                Spiller 1
              </label>
              <CreatableSelect
                id="player1"
                isClearable
                onChange={handlePlayer1Change}
                options={playerOptions}
                className="mt-1 w-3/4 dark:text-black"
                placeholder="Select or create Player 1"
              />
            </div>
            <div>
              <label
                htmlFor="player2"
                className="block text-sm dark:text-white font-medium text-gray-700"
              >
                Spiller 2
              </label>
              <CreatableSelect
                id="player2"
                isClearable
                onChange={handlePlayer2Change}
                options={playerOptions}
                className="mt-1 w-3/4 dark:text-black"
                placeholder="Select or create Player 2"
              />
            </div>

            <div className="">
              <label
                htmlFor="winner"
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
                className="mb-4 dark:text-black w-2/3"
                classNamePrefix="react-select"
              />
              <button
                disabled={!isFormValid} // Disable the button if the form is not valid
                type="submit"
                className="m-4 bg-blue-600 dark:bg-gray-400 dark:text-black hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white px-4 py-2 rounded"
              >
                Lagre resultat
              </button>
            </div>
          </div>
        </fetcher.Form>
        <h2 className="text-2xl font-semibold mb-3 dark:text-white">
          Spillere:
        </h2>
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
            {players
              .sort((a, b) => b.currentELO - a.currentELO)
              .map((player) => (
                <tr
                  key={player.id}
                  className="border-t dark:border-gray-700 text-xl"
                >
                  <td className="px-4 py-2 font-semibold dark:text-white">
                    {player.name}
                  </td>
                  <td className="px-4 py-2 align-middle text-center dark:text-white">
                    {player.matchesAsWinner.length}
                  </td>
                  <td className="px-4 py-2 align-middle text-center dark:text-white">
                    {player.matchesAsLoser.length}
                  </td>
                  <td className="px-4 py-2 align-middle text-center dark:text-white">
                    {player.matchesAsLoser.length +
                      player.matchesAsWinner.length}
                  </td>
                  <td className="px-4 py-2 align-middle text-center dark:text-white">
                    {player.currentELO}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

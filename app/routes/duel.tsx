// routes/index.tsx
import {
  type MetaFunction,
  type ActionFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { createPlayer, getPlayers } from "../services/player-service";
import {
  recordMatch,
  updateELO,
  findPlayerByName,
  calculateNewELOs,
  logIndividualELO,
} from "../services/player-service";
import { PageContainerStyling } from "./team";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

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

export const loader = async () => {
  const players = await getPlayers();
  return { players };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const player1Name = formData.get("player1");
  const player2Name = formData.get("player2");
  const winner = formData.get("winner");

  if (
    typeof player1Name === "string" &&
    typeof player2Name === "string" &&
    typeof winner === "string"
  ) {
    try {
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

      const match = await recordMatch(
        winnerId,
        loserId,
        player1IsWinner ? newELOPlayer1 : newELOPlayer2,
        player1IsWinner ? newELOPlayer2 : newELOPlayer1
      );
      await updateELO(player1.id, newELOPlayer1);
      await logIndividualELO(player1.id, newELOPlayer1, match.id); // Log the new ELO for player 1
      await updateELO(player2.id, newELOPlayer2);
      await logIndividualELO(player2.id, newELOPlayer2, match.id); // Log the new ELO for player 2
      formData.set("player1", "");
      formData.set("player2", "");
      formData.set("winner", "");
    } catch (err) {
      console.error(err);
    }
  }

  return redirect("/duel-stats");
};

export default function Index() {
  const { players } = useLoaderData<typeof loader>();
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

    if (player1 === player2) {
      alert("Player 1 and Player 2 cannot be the same!");
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
    <div className={PageContainerStyling}>
      <h1 className="text-4xl p-4 font-arial font-bold text-center dark:text-white">
        1v1
      </h1>
      <div className="flex-col justify-center">
        <details className="mb-4">
          <summary className="dark:text-white">Hvordan bruke?</summary>
          <div className="dark:text-gray-400">
            <h2 className="text-xl font-semibold mb-3 dark:text-white">
              Hvordan bruke:
            </h2>
            <p className="mb-3">
              Skriv inn navnene på spillerne og velg vinneren. ELOene vil bli oppdatert automatisk.
            </p>
            <p className="mb-3">
              Hvis en spiller ikke er på listen, skriv inn navnet deres og send inn skjemaet.
              De vil bli lagt til listen, og deres ELO vil bli satt til 1500.
            </p>
            <p className="mb-3">
              Hvis du ønsker å se ELO-historikken til en spiller, klikk på navnet deres i tabellen nedenfor.
            </p>
          </div>
        </details>

        <div className="flex justify-center mb-6">
          <img src="img/1v1krok.png" alt="1v1" className="w-1/3 rounded" />
        </div>
        <fetcher.Form method="post" onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ">
            <div className="flex-col">
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
                className="mt-1 w-3/4 m-auto dark:text-black"
                placeholder="Legg til Spiller 1"
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
                className="mt-1 w-3/4 m-auto dark:text-black"
                placeholder="Legg til Spiller 2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 w-full mt-4">
            <div>
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
                className="mb-4 m-auto w-1/2 dark:text-black"
                classNamePrefix="react-select"
              />
            </div>
            <div className="flex justify-center">
              <button
                disabled={!isFormValid} // Disable the button if the form is not valid
                type="submit"
                className="m-4 w-1/2 text-center bg-blue-600 dark:bg-gray-400 dark:text-black hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none text-white px-4 py-2 rounded"
              >
                Lagre resultat
              </button>
            </div>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}

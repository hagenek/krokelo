// routes/index.tsx
import {
  type MetaFunction,
  type ActionFunction,
  redirect,
} from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { SetStateAction, useState } from 'react';
import { createPlayer, getPlayers } from '../services/player-service';
import {
  recordMatch,
  updateELO,
  findPlayerByName,
  calculateNewELOs,
  logIndividualELO,
} from '../services/player-service';
import { PageContainerStyling } from './team';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

export const meta: MetaFunction = () => {
  return [
    { title: 'SB1U Krok Champions' },
    {
      property: 'og:title',
      content: 'SB1U Krokinole Champions',
    },
    {
      name: 'description',
      content: 'Her kan du registrere resultater fra SB1U Krokinolekamper.',
    },
  ];
};

export const loader = async () => {
  const players = await getPlayers();
  return { players };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const player1Name = formData.get('player1');
  const player2Name = formData.get('player2');
  const winner = formData.get('winner');

  if (
    typeof player1Name === 'string' &&
    typeof player2Name === 'string' &&
    typeof winner === 'string'
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
      formData.set('player1', '');
      formData.set('player2', '');
      formData.set('winner', '');
    } catch (err) {
      console.error(err);
    }
  }

  return redirect('/duel-stats');
};

export default function Index() {
  const { players } = useLoaderData<typeof loader>();
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [winner, setWinner] = useState(null);

  const fetcher = useFetcher();

  const playerOptions = players.map((player) => ({
    value: player.name,
    label: player.name,
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Simple validation
    if (!player1 || !player2 || !winner) {
      alert('All fields are required!');
      return;
    }

    if (player1 === player2) {
      alert('Player 1 and Player 2 cannot be the same!');
      return;
    }

    // Use the fetcher form to submit
    fetcher.submit({ player1, player2, winner }, { method: 'post' });

    // // Reset form fields
    // setPlayer1(null);
    // setPlayer2(null);
    // setWinner(null);
  };

  const isFormValid = !!player1 && !!player2 && !!winner;

  return (
    <div className={PageContainerStyling}>
      <h1 className="font-arial p-4 text-center text-4xl font-bold dark:text-white">
        1v1
      </h1>
      <div>
        {/* <details className="mb-4">
          <summary className="dark:text-white">Hvordan bruke?</summary>
          <div className="dark:text-gray-400">
            <h2 className="mb-3 text-xl font-semibold dark:text-white">
              Hvordan bruke:
            </h2>
            <p className="mb-3">
              Skriv inn navnene på spillerne og velg vinneren. ELOene vil bli
              oppdatert automatisk.
            </p>
            <p className="mb-3">
              Hvis en spiller ikke er på listen, skriv inn navnet deres og send
              inn skjemaet. De vil bli lagt til listen, og deres ELO vil bli
              satt til 1500.
            </p>
            <p className="mb-3">
              Hvis du ønsker å se ELO-historikken til en spiller, klikk på
              navnet deres i tabellen nedenfor.
            </p>
          </div>
        </details> */}

        <div className="flex justify-center p-4">
          <img src="img/1v1krok.png" alt="1v1" className="w-1/3 rounded" />
        </div>
        <fetcher.Form method="post" onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-4 py-4">
            <div className="col-span-8 col-start-3 flex flex-col items-start lg:col-span-4 lg:col-start-5">
              <label
                htmlFor="player1"
                className="text-sm font-medium text-gray-700 dark:text-white"
              >
                Spiller 1
              </label>
              <CreatableSelect
                id="player1"
                isClearable
                onChange={(option) => setPlayer1(option ? option.value : '')}
                options={playerOptions}
                className="mt-1 w-full dark:text-black"
                placeholder="Legg til Spiller 1"
              />
              <label
                htmlFor="player2"
                className="mt-4 text-sm font-medium text-gray-700 dark:text-white"
              >
                Spiller 2
              </label>
              <CreatableSelect
                id="player2"
                isClearable
                onChange={(option) => setPlayer2(option ? option.value : '')}
                options={playerOptions}
                className="mt-1 w-full dark:text-black"
                placeholder="Legg til Spiller 2"
              />
              <p className="mt-4 text-sm font-medium text-gray-700 dark:text-white">
                Hvem vant?
              </p>
              <div className="flex flex-col items-start">
                <label className="mt-2">
                  <input
                    type="radio"
                    value={player1}
                    disabled={!player1}
                    checked={player1 ? player1 === winner : false}
                    onChange={(e) => setWinner(e.target.value)}
                    className="mr-2"
                  />
                  {player1 || 'Spiller 1'}
                </label>
                <label className="mt-2">
                  <input
                    type="radio"
                    value={player2}
                    disabled={!player2}
                    checked={player2 ? player2 === winner : false}
                    onChange={(e) => setWinner(e.target.value)}
                    className="mr-2"
                  />
                  {player2 || 'Spiller 2'}
                </label>
              </div>
              <button
                disabled={!isFormValid} // Disable the button if the form is not valid
                type="submit"
                className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-400 dark:text-black"
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

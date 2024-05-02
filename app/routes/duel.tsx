import {
  type MetaFunction,
  type ActionFunctionArgs,
  redirect,
} from '@remix-run/node';
import { useActionData, Form, useSubmit } from '@remix-run/react';
import { useState } from 'react';
import {
  createPlayer,
  getPlayers,
  updatePlayerELO,
  findPlayerByName,
  calculateNewELOs,
  logIndividualELO,
} from '../services/player-service';
import { recordMatch } from '../services/match-service';
import { PageContainerStyling } from './team-duel';
import CreatableSelect from 'react-select/creatable';
import { createFilter } from 'react-select';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

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
  return typedjson({ players });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const player1Name = String(formData.get('player1'));
  const player2Name = String(formData.get('player2'));
  const winner = String(formData.get('winner'));
  const validationErrors = {
    player1: '',
    player2: '',
    winner: '',
  };

  if (!player1Name) {
    validationErrors.player1 = 'Spiller 1 må fylles ut';
  }
  if (!player2Name) {
    validationErrors.player2 = 'Spiller 2 må fylles ut';
  }
  if (player1Name && player2Name && player1Name === player2Name) {
    validationErrors.player2 = 'Spiller 1 og Spiller 2 kan ikke være like!';
  }
  if (!winner) {
    validationErrors.winner = 'Vinner må velges';
  }

  const hasValidationErrors = Object.values(validationErrors).some(
    (error) => !!error
  );
  if (hasValidationErrors) {
    return { validationErrors };
  }

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
    await updatePlayerELO(player1.id, newELOPlayer1);
    await logIndividualELO(player1.id, newELOPlayer1, match.id); // Log the new ELO for player 1
    await updatePlayerELO(player2.id, newELOPlayer2);
    await logIndividualELO(player2.id, newELOPlayer2, match.id); // Log the new ELO for player 2
  } catch (err) {
    console.error(err);
  }

  return redirect('/duel-stats');
};

export default function Index() {
  const { players } = useTypedLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const [duel, setDuel] = useState({ player1: '', player2: '', winner: '' });

  const playerOptions = players.map((player) => ({
    value: player.name,
    label: player.name,
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(duel, { method: 'post' });
  };

  return (
    <div className={PageContainerStyling}>
      <h1 className="font-arial p-4 text-center text-4xl font-bold dark:text-white">
        1v1
      </h1>
      <div>
        <div className="flex justify-center p-4">
          <img src="img/1v1krok.png" alt="1v1" className="w-1/3 rounded" />
        </div>
        <Form method="post" onSubmit={handleSubmit}>
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
                className="mt-1 w-full dark:text-black"
                placeholder="Legg til Spiller 1"
                isClearable
                options={playerOptions}
                filterOption={(option, rawInput) =>
                  createFilter()(option, rawInput) &&
                  option.value !== duel.player2
                }
                onChange={(option) =>
                  setDuel({
                    ...duel,
                    player1: option ? option.value : '',
                    winner: '',
                  })
                }
              />
              {actionData?.validationErrors?.player1 && (
                <em className="text-red-600">
                  {actionData?.validationErrors.player1}
                </em>
              )}
              <label
                htmlFor="player2"
                className="mt-4 text-sm font-medium text-gray-700 dark:text-white"
              >
                Spiller 2
              </label>
              <CreatableSelect
                id="player2"
                className="mt-1 w-full dark:text-black"
                placeholder="Legg til Spiller 2"
                isClearable
                options={playerOptions}
                filterOption={(option, rawInput) =>
                  createFilter()(option, rawInput) &&
                  option.value !== duel.player1
                }
                onChange={(option) =>
                  setDuel({
                    ...duel,
                    player2: option ? option.value : '',
                    winner: '',
                  })
                }
              />
              {actionData?.validationErrors?.player2 ? (
                <em className="text-red-600">
                  {actionData?.validationErrors.player2}
                </em>
              ) : null}
              <p className="mt-4 text-sm font-medium text-gray-700 dark:text-white">
                Hvem vant?
              </p>
              <div className="flex flex-col items-start">
                <label className="mt-2">
                  <input
                    type="radio"
                    value={duel.player1}
                    disabled={!duel.player1}
                    checked={
                      duel.player1 ? duel.player1 === duel.winner : false
                    }
                    onChange={(e) =>
                      setDuel({ ...duel, winner: e.target.value })
                    }
                    className="mr-2"
                  />
                  {duel.player1 || 'Spiller 1'}
                </label>
                <label className="mt-2">
                  <input
                    type="radio"
                    value={duel.player2}
                    disabled={!duel.player2}
                    checked={
                      duel.player2 ? duel.player2 === duel.winner : false
                    }
                    onChange={(e) =>
                      setDuel({ ...duel, winner: e.target.value })
                    }
                    className="mr-2"
                  />
                  {duel.player2 || 'Spiller 2'}
                </label>
              </div>
              {actionData?.validationErrors?.winner ? (
                <em className="text-red-600">
                  {actionData?.validationErrors.winner}
                </em>
              ) : null}
              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Lagre resultat
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

// routes/index.tsx
import {
  type MetaFunction,
  type ActionFunctionArgs,
  redirect,
} from '@remix-run/node';
import {
  useLoaderData,
  useActionData,
  Form,
  useSubmit,
} from '@remix-run/react';
import { useState } from 'react';
import { Player, createPlayer, getPlayers } from '../services/player-service';
import {
  recordMatch,
  updateELO,
  findPlayerByName,
  calculateNewELOs,
  logIndividualELO,
} from '../services/player-service';
import { PageContainerStyling } from './team';
import CreatableSelect from 'react-select/creatable';
import GenericSearchableDropdown from '~/ui/searchable-dropdown';
import { Jsonify } from '@remix-run/server-runtime/dist/jsonify';

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

export default function Index() {
  const { players } = useLoaderData<typeof loader>();

  const [player1, setPlayer1] = useState<Jsonify<Player> | undefined>(
    undefined
  );
  const [player2, setPlayer2] = useState<Jsonify<Player> | undefined>(
    undefined
  );

  const player1Matches = player1?.matchesAsWinner + player1?.matchesAsLoser;

  const handlePlayerChange = (
    playerId: number,
    setPlayer: React.Dispatch<React.SetStateAction<Jsonify<Player> | undefined>>
  ) => {
    const player = players.find((p) => p.id === playerId);
    setPlayer(player);
    // setSelectedPlayer(player || null);
    // navigate(`/profile/${playerId}`);
  };

  return (
    <div className="flex">
      <GenericSearchableDropdown
        className="mt-4"
        items={players}
        onItemSelect={(playerId) => handlePlayerChange(playerId, setPlayer1)}
        placeholder={'Velg spiller 1'}
        selectedItem={player1}
      />
      <GenericSearchableDropdown
        className="mt-4"
        items={players}
        onItemSelect={(playerId) => handlePlayerChange(playerId, setPlayer2)}
        placeholder={'Velg spiller 2'}
        selectedItem={player2}
      />
    </div>
  );
}

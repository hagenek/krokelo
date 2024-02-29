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
import GenericSearchableDropdown from "~/ui/searchable-dropdown";

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

    const [duel, setDuel] = useState({ player1: '', player2: '', winner: '' });

    const playerOptions = players.map((player) => ({
        value: player.name,
        label: player.name,
    }));

    return (
        <>
            <GenericSearchableDropdown
                items={players}
                onItemSelect={handlePlayerChange}
                placeholder={'Velg spiller'}
            />
            <GenericSearchableDropdown
                items={players}
                onItemSelect={handlePlayerChange}
                placeholder={'Velg spiller'}
            />
        </>
    )
}

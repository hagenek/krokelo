// routes/index.tsx
import {
  type MetaFunction,
  type ActionFunctionArgs,
  redirect,
} from '@remix-run/node';
import CreatableSelect from 'react-select/creatable';
import { createFilter } from 'react-select';
import {
  useLoaderData,
  useActionData,
  useSubmit,
  Form,
} from '@remix-run/react';
import { useState } from 'react';
import {
  calculateNewIndividualELOs,
  createPlayer,
  createTeam,
  getPlayers,
} from '../services/player-service';
import {
  recordTeamMatch,
  updateAndLogELOsTeamPlay,
} from '../services/team-service';
import {
  findPlayerByName,
  calculateNewTeamELOs,
} from '../services/player-service';

export type Match = {
  id: number;
  date: string;
  winnerId: number;
  loserId: number;
  winnerELO: number;
  loserELO: number;
  playerId: number | null;
};

export const PageContainerStyling =
  'flex-col rounded-3xl justify-center items-center dark:bg-gray-800 dark:text-white mx-auto';

type ELOLog = {
  id: number;
  playerId: number;
  elo: number;
  date: string;
  matchId: number;
};

export type EnrichedPlayer = {
  id: number;
  name: string;
  currentELO: number;
  currentTeamELO: number;
  matchesAsWinner: Match[];
  matchesAsLoser: Match[];
  eloLogs: ELOLog[];
  teamStats: {
    totalMatches: number;
    wins: number;
    losses: number;
  };
};

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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const team1String = String(formData.get('team1'));
  const team2String = String(formData.get('team2'));
  const winningTeam = String(formData.get('winner'));

  const team1 = team1String ? team1String.split(',') : [];
  const team2 = team2String ? team2String.split(',') : [];

  const validationErrors = {
    team1: '',
    team2: '',
    winner: '',
  };

  console.log('team1', team1);
  console.log('team2', team2);

  if (team1.length !== 2) {
    validationErrors.team1 = 'Laget må ha to spillere';
  }
  if (team2.length !== 2) {
    validationErrors.team2 = 'Laget må ha to spillere';
  }
  if (team2.some((player) => team1.includes(player))) {
    validationErrors.team2 = 'En spiller kan ikke være på begge lag';
  }
  if (!winningTeam) {
    validationErrors.winner = 'Vinnerlag må velges';
  }

  const hasValidationErrors = Object.values(validationErrors).some(
    (error) => !!error
  );
  if (hasValidationErrors) {
    return { validationErrors };
  }

  const [team1Player1Name, team1Player2Name] = team1;
  const [team2Player1Name, team2Player2Name] = team2;

  try {
    const team1Player1 =
      (await findPlayerByName(team1Player1Name)) ||
      (await createPlayer(team1Player1Name));
    const team1Player2 =
      (await findPlayerByName(team1Player2Name)) ||
      (await createPlayer(team1Player2Name));

    const team2Player1 =
      (await findPlayerByName(team2Player1Name)) ||
      (await createPlayer(team2Player1Name));

    const team2Player2 =
      (await findPlayerByName(team2Player2Name)) ||
      (await createPlayer(team2Player2Name));

    // Create or find teams
    const team1 = await createTeam(team1Player1.id, team1Player2.id);
    const team2 = await createTeam(team2Player1.id, team2Player2.id);

    const team1IsWinner = winningTeam === 'team1';

    // Calculate new ELOs for each team
    const { newELOTeam1, newELOTeam2 } = calculateNewTeamELOs(
      team1.currentELO,
      team2.currentELO,
      team1IsWinner
    );

    const {
      newELOPlayer1Team1,
      newELOPlayer2Team1,
      newELOPlayer1Team2,
      newELOPlayer2Team2,
    } = calculateNewIndividualELOs(
      team1Player1.currentTeamELO,
      team1Player2.currentTeamELO,
      team2Player1.currentTeamELO,
      team2Player2.currentTeamELO,
      team1IsWinner
    );

    // Determine winner and loser team IDs
    const winnerTeamId = team1IsWinner ? team1.id : team2.id;
    const loserTeamId = team1IsWinner ? team2.id : team1.id;

    // Record team match
    const match = await recordTeamMatch(
      winnerTeamId,
      loserTeamId,
      newELOTeam1,
      newELOTeam2
    );

    await updateAndLogELOsTeamPlay({
      teamData: {
        team1Id: team1.id,
        team2Id: team2.id,
        newELOTeam1: newELOTeam1,
        newELOTeam2: newELOTeam2,
      },
      playerData: {
        player1Id: team1Player1.id,
        player2Id: team1Player2.id,
        player3Id: team2Player1.id,
        player4Id: team2Player2.id,
        newELOPlayer1: newELOPlayer1Team1,
        newELOPlayer2: newELOPlayer2Team1,
        newELOPlayer3: newELOPlayer1Team2,
        newELOPlayer4: newELOPlayer2Team2,
      },
      matchId: match.id,
    });
  } catch (error) {
    console.error('Error in action function:', error);
  }

  return redirect('/team-stats');
};

export default function Index() {
  const { players } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const [teamDuel, setTeamDuel] = useState<{
    team1: string[];
    team2: string[];
    winner: string;
  }>({
    team1: [],
    team2: [],
    winner: '',
  });

  const playerOptions = players.map((player) => ({
    value: player.name,
    label: player.name,
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(teamDuel, { method: 'post' });
  };

  return (
    <div className={PageContainerStyling}>
      <h1 className="font-arial p-4 text-center text-4xl font-bold dark:text-white">
        2v2
      </h1>
      <div>
        <div className="flex justify-center p-4">
          <img src="img/2v2krok.png" alt="2v2" className="w-1/3 rounded" />
        </div>
        <Form method="post" onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-4 py-4">
            <div className="col-span-10 col-start-2 flex flex-col items-start lg:col-span-4 lg:col-start-5">
              <label
                htmlFor="team1"
                className="text-sm font-medium text-gray-700 dark:text-white"
              >
                Lag 1
              </label>
              <CreatableSelect
                id="team1"
                className="mt-1 w-full dark:text-black"
                placeholder="Legg til 2 spillere"
                isMulti
                isClearable
                options={playerOptions}
                isOptionDisabled={() => teamDuel.team1.length >= 2}
                closeMenuOnSelect={teamDuel.team1.length > 0}
                filterOption={(option, rawInput) =>
                  createFilter()(option, rawInput) &&
                  !teamDuel.team2.includes(option.value)
                }
                onChange={(options) =>
                  setTeamDuel({
                    ...teamDuel,
                    team1: options.map((option) => option.value),
                    winner: '',
                  })
                }
              />
              {actionData?.validationErrors?.team1 && (
                <em className="text-red-600">
                  {actionData?.validationErrors.team1}
                </em>
              )}
              <label
                htmlFor="team2"
                className="mt-4 text-sm font-medium text-gray-700 dark:text-white"
              >
                Lag 2
              </label>
              <CreatableSelect
                id="team2"
                className="mt-1 w-full dark:text-black"
                placeholder="Legg til 2 spillere"
                isMulti
                isClearable
                options={playerOptions}
                isOptionDisabled={() => teamDuel.team2.length >= 2}
                closeMenuOnSelect={teamDuel.team2.length > 0}
                filterOption={(option, rawInput) =>
                  createFilter()(option, rawInput) &&
                  !teamDuel.team1.includes(option.value)
                }
                onChange={(options) =>
                  setTeamDuel({
                    ...teamDuel,
                    team2: options.map((option) => option.value),
                    winner: '',
                  })
                }
              />
              {actionData?.validationErrors?.team2 ? (
                <em className="text-red-600">
                  {actionData?.validationErrors.team2}
                </em>
              ) : null}
              <p className="mt-4 text-sm font-medium text-gray-700 dark:text-white">
                Hvem vant?
              </p>
              <div className="flex flex-col items-start">
                <label className="mt-2">
                  <input
                    type="radio"
                    value={'team1'}
                    disabled={teamDuel.team1.length !== 2}
                    checked={teamDuel.winner === 'team1'}
                    onChange={(e) =>
                      setTeamDuel({ ...teamDuel, winner: e.target.value })
                    }
                    className="mr-2"
                  />
                  {teamDuel.team1.length === 2
                    ? teamDuel.team1.join(' og ')
                    : 'Lag 1'}
                </label>
                <label className="mt-2">
                  <input
                    type="radio"
                    value={'team2'}
                    disabled={teamDuel.team2.length !== 2}
                    checked={teamDuel.winner === 'team2'}
                    onChange={(e) =>
                      setTeamDuel({ ...teamDuel, winner: e.target.value })
                    }
                    className="mr-2"
                  />
                  {teamDuel.team2.length === 2
                    ? teamDuel.team2.join(' og ')
                    : 'Lag 2'}
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

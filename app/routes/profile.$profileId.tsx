import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from '@remix-run/node';
import { Form, useNavigate, useSubmit } from '@remix-run/react';
import { EloHistoryChart } from '~/components/elo-history-charts';
import { getPlayers, updatePlayerStatus } from '~/services/player-service';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import Select from 'react-select';
import { PageContainerStyling } from './team-duel';

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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const playerId = parseInt(params.profileId || '0', 10);

  const players = await getPlayers();
  const player = players.find((player) => player.id === playerId);

  return typedjson({ players, player });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const playerId = parseInt(formData.get('playerId') as string, 10);
  const inactive = formData.get('inactive') === 'on';
  await updatePlayerStatus(playerId, inactive);

  return redirect(`/profile/${playerId}`);
};

export default function Index() {
  const navigate = useNavigate();
  const { players, player } = useTypedLoaderData<typeof loader>();
  const submit = useSubmit();
  const playersSortedOnELODesc = [...players]
    .filter((player) => !player.inactive)
    .sort((p1, p2) => p2.currentELO - p1.currentELO);

  const playersSortedOnTeamELODesc = [...players]
    .filter((player) => !player.inactive)
    .sort((p1, p2) => p2.currentTeamELO - p1.currentTeamELO);

  const playerOptions = players.map((player) => ({
    value: player.id,
    label: player.name,
  }));

  const numberOfWins = player ? player.matchesAsWinner.length : 0;
  const numberOfLosses = player ? player.matchesAsLoser.length : 0;
  const numberOfMatches = numberOfWins + numberOfLosses;
  const winPercentage = (numberOfWins / numberOfMatches) * 100;

  const findLongestWinStreak = (eloLogs) => {
    if (eloLogs.length === 0) return 0;

    const logs = [...eloLogs].reverse();
    let longestWinStreak = 0;
    let currentWinStreak = 0;
    logs[0].elo > 1500 && (currentWinStreak = 1);
    for (let i = 1; i < logs.length; i++) {
      if (logs[i].elo > logs[i - 1].elo) {
        currentWinStreak++;
      } else {
        if (currentWinStreak > longestWinStreak) {
          longestWinStreak = currentWinStreak;
        }
        currentWinStreak = 0;
      }
    }

    // Final check in case the longest streak is at the end
    if (currentWinStreak > longestWinStreak) {
      longestWinStreak = currentWinStreak;
    }

    return longestWinStreak;
  };

  return (
    <div className={PageContainerStyling}>
      <div className="flex justify-center py-4">
        <Select
          id="playerProfileSelect"
          value={playerOptions.find((p) => p.value === player?.id)}
          className="basis-2/3 md:basis-1/3 dark:text-black"
          placeholder="Velg spiller"
          isClearable
          options={playerOptions}
          onChange={(option) => {
            navigate(`/profile/${option ? option.value : 0}`);
          }}
        />
      </div>

      {player && (
        <div>
          <ul className="mb-2 flex-col items-center space-y-2 rounded-lg bg-blue-100 p-4 text-center text-lg text-black shadow-lg dark:bg-gray-700 dark:text-white">
            <li className="text-4xl">{player.name}</li>
            <li>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  Rating duellspill:{' '}
                  <span className="font-bold dark:text-green-200">
                    {player.currentELO}
                  </span>
                </div>
                <div>
                  Rating lagspill:{' '}
                  <span className="font-bold dark:text-green-200">
                    {player.currentTeamELO}
                  </span>
                </div>
              </div>
            </li>
            <li>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  Høyeste rating duellspill 🏔️:{' '}
                  <span className="font-bold dark:text-green-200">
                    {Math.max(1500, ...player.eloLogs.map((log) => log.elo))}
                  </span>
                </div>
                <div>
                  Høyeste rating lagspill 🏔️:{' '}
                  <span className="font-bold dark:text-green-200">
                    {Math.max(
                      1500,
                      ...player.teamPlayerELOLog.map((log) => log.elo)
                    )}
                  </span>
                </div>
                <div>
                  Lengste win streak - duell 🔥:{' '}
                  <span className="font-bold dark:text-green-200">
                    {findLongestWinStreak(player.eloLogs)}
                  </span>
                </div>
                <div>
                  Lengste win streak - lag 🔥:{' '}
                  <span className="font-bold dark:text-green-200">
                    {findLongestWinStreak(player.teamPlayerELOLog)}
                  </span>
                </div>
              </div>
            </li>
            <div className="grid gap-2 md:grid-cols-2">
              {!player.inactive && (
                <li className="flex items-center justify-center space-x-2 text-center">
                  <span className="flex text-lg">
                    {playersSortedOnELODesc.findIndex(
                      (p) => p.id === player.id
                    ) < 5 && (
                      <div className="group">
                        <img
                          src="/img/medal.png"
                          alt="Medalje for topp 5 plassering"
                          className="mr-2 h-8 w-8"
                        />
                        <span
                          className="text-md absolute bottom-full left-1/2 hidden -translate-x-1/2 translate-y-1 transform
                    rounded bg-black px-2 py-1 pb-1 text-white opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100"
                        >
                          Medalje for topp 5 plassering
                        </span>
                      </div>
                    )}
                    Rangering duellspill:{' '}
                    <span className="ml-2 font-bold dark:text-blue-200">
                      {`${playersSortedOnELODesc.findIndex((p) => p.id === player.id) + 1} / ${playersSortedOnELODesc?.length}`}
                    </span>
                  </span>
                </li>
              )}
              {!player.inactive && (
                <li className="flex items-center justify-center space-x-2">
                  <span className="flex p-2 text-lg">
                    {playersSortedOnTeamELODesc.findIndex(
                      (p) => p.id === player.id
                    ) < 5 && (
                      <div className="group text-center">
                        <img
                          src="/img/medal.png"
                          alt="Medalje for topp 5 plassering"
                          className="mr-2 h-8 w-8"
                        />
                        <span className="text-md absolute bottom-full left-1/2 hidden -translate-x-1/2 translate-y-1 transform rounded bg-black px-2 py-1 pb-1 text-white opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100">
                          Medalje for topp 5 plassering
                        </span>
                      </div>
                    )}
                    Rangering lagspill:{' '}
                    <span className="ml-2 font-bold dark:text-blue-200">
                      {`${playersSortedOnTeamELODesc.findIndex((p) => p.id === player.id) + 1} / ${playersSortedOnTeamELODesc.length}`}
                    </span>
                  </span>
                </li>
              )}
            </div>
            <div className="text-lg">
              Inaktiv spiller:{' '}
              <Form
                method="post"
                action={`/profile/${player.id}`}
                onChange={(e) => submit(e.currentTarget)}
              >
                <input type="hidden" name="playerId" value={player.id} />
                <input
                  type="checkbox"
                  name="inactive"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={player.inactive}
                  onChange={(e) => {
                    submit(e.currentTarget.form);
                  }}
                />
              </Form>
            </div>
          </ul>
          <div className="flex flex-col justify-center">
            <h2 className="mb-2 text-xl font-bold dark:text-green-200">
              Duellspill
            </h2>
            <table
              className="mb-2 table-auto rounded-lg bg-blue-100
             p-4 text-lg text-black shadow-lg dark:bg-gray-700 dark:text-white"
            >
              <thead>
                <tr className="text-md">
                  <th className="w-1/5 py-2"># kamper</th>
                  <th className="w-1/5 py-2"># seiere</th>
                  <th className="w-1/5 py-2"># tap</th>
                  <th className="w-2/5 py-2"># overlegenhet</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-md">
                  <td className="border py-2">{numberOfMatches}</td>
                  <td className="border py-2">{numberOfWins}</td>
                  <td className="border py-2">{numberOfLosses}</td>
                  <td className="border py-2">
                    {`${winPercentage ? winPercentage.toFixed(2) : 0} %`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {player.teamPlayerELOLog.length > 0 && (
            <>
              <h1 className="my-4 text-xl font-bold">
                {player.name} sin ELO-historikk i lagspill
              </h1>
              <EloHistoryChart data={[...player.teamPlayerELOLog].reverse()} />
            </>
          )}
          {player.eloLogs.length > 0 && (
            <>
              <h1 className="my-4 text-xl font-bold">
                {player.name} sin ELO-historikk i duellspill
              </h1>
              <EloHistoryChart data={[...player.eloLogs].reverse()} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import { EloHistoryChart } from '~/components/elo-history-charts';
import { getTeams } from '~/services/team-service';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import Select from 'react-select';
import { PageContainerStyling } from './team-duel';

export const meta: MetaFunction = () => {
  return [
    { title: 'SB1U Krok Champions - Teams' },
    { property: 'og:title', content: 'SB1U Krokinole Champions - Teams' },
    {
      name: 'description',
      content: 'List and stats of all the teams in Krok Champions.',
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const teamId = parseInt(params.teamId || '0', 10);

  const teams = await getTeams();
  const team = teams.find((team) => team.id === teamId);

  return typedjson({ teams, team });
};

export default function Index() {
  const navigate = useNavigate();
  const { teams, team } = useTypedLoaderData<typeof loader>();

  const teamsSortedOnELODesc = [...teams].sort(
    (t1, t2) => t2.currentELO - t1.currentELO
  );
  const topFiveTeamIds = teamsSortedOnELODesc.slice(0, 5).map((t) => t.id);

  const teamOptions = teams.map((team) => ({
    value: team.id,
    label: team.name,
  }));

  const numberOfWins = team ? team.teamMatchesAsWinner.length : 0;
  const numberOfLosses = team ? team.teamMatchesAsLoser.length : 0;
  const numberOfMatches = numberOfWins + numberOfLosses;
  const winPercentage = (numberOfWins / numberOfMatches) * 100;

  return (
    <div className={PageContainerStyling}>
      <div className="flex justify-center py-4">
        <Select
          id="teamProfileSelect"
          value={teamOptions.find((p) => p.value === team?.id)}
          className="basis-2/3 md:basis-1/3 dark:text-black"
          placeholder="Velg lag"
          isClearable
          options={teamOptions}
          onChange={(option) => {
            navigate(`/team-profile/${option ? option.value : 0}`);
          }}
        />
      </div>

      {team && (
        <div>
          <ul className="mb-2 mt-4 flex items-center justify-center space-y-2 rounded-lg bg-blue-100 p-4 text-center text-center text-lg text-black shadow-lg dark:bg-gray-700 dark:text-white">
            <div>
              {topFiveTeamIds.includes(team.id) && (
                <span className="group">
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
                </span>
              )}
            </div>
            <li>
              Rating lagspill:{' '}
              <span className="font-bold dark:text-green-200">
                {team.currentELO}
              </span>
            </li>
          </ul>
          <div className="flex flex-col justify-center">
            <h2 className="mb-2 text-xl font-bold dark:text-green-200">
              Lagspill
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
          {team.TeamELOLog.length > 0 && (
            <>
              <h1 className="my-4 text-xl font-bold">
                {team.name} sin ELO-historikk i lagspill
              </h1>
              <EloHistoryChart data={[...team.TeamELOLog].reverse()} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

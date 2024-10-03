import { type MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { PageContainerStyling } from './team-duel';
import { ActivityGraph } from '~/components/activity-graph';
import { getDatesFrom1v1MatchesLastSevenDays } from '~/services/match-service';
import { getDatesFromTeamMatchesLastSevenDays } from '~/services/team-match-service';
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
  const datesFrom1v1MatchesLastSevenDays =
    await getDatesFrom1v1MatchesLastSevenDays();
  const datesFromTeamMatchesLastSevenDays =
    await getDatesFromTeamMatchesLastSevenDays();

  const datesFromAllMatchesLastSevenDays = datesFrom1v1MatchesLastSevenDays
    .map((match) => match.date)
    .concat(datesFromTeamMatchesLastSevenDays.map((match) => match.date));

  datesFromAllMatchesLastSevenDays.sort(
    (d1, d2) => d2.getTime() - d1.getTime()
  );

  return typedjson(datesFromAllMatchesLastSevenDays);
};

export default function Index() {
  const datesFromAllMatchesLastSevenDays = useTypedLoaderData<typeof loader>();

  return (
    <div className={PageContainerStyling}>
      <div className="grid gap-4 md:gap-6 xl:grid-cols-2">
        <Link
          to="/duel"
          className="flex flex-col items-center rounded px-4 py-2 font-bold text-white hover:bg-blue-700 dark:hover:bg-gray-700"
        >
          <span className="mt-2 text-2xl text-gray-900 md:mb-2 md:text-4xl dark:text-white">
            1v1
          </span>
          <img
            src="img/1v1krok.png"
            alt="1v1"
            className="w-1/2 rounded md:w-full"
          />
        </Link>
        <Link
          to="/team-duel"
          className="flex flex-col items-center rounded px-4 py-2 font-bold text-white hover:bg-blue-700 dark:hover:bg-gray-700"
        >
          <span className="mt-2 text-2xl text-gray-900 md:mb-2 md:text-4xl dark:text-white">
            2v2
          </span>
          <img
            src="img/2v2krok.png"
            alt="2v2"
            className="w-1/2 rounded md:w-full"
          />
        </Link>
      </div>
      <div className="p-4">
        <ActivityGraph dates={datesFromAllMatchesLastSevenDays} />
      </div>
    </div>
  );
}

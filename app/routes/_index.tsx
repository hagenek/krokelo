// routes/index.tsx
import type {LoaderFunction, MetaFunction} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PageContainerStyling } from "./team";
import { ActivityGraph } from "~/ui/activity-graph";
import { getMatchesLastSevenDays, MatchMinimal } from "~/services/match-service";

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
  const fetchedMatches = await getMatchesLastSevenDays();

  return fetchedMatches.map(match => ({
    ...match,
    date: new Date(match.date),
  }));
};

export default function Index() {
  const matches = useLoaderData<MatchMinimal[]>();
  const parsedMatches : MatchMinimal[] = matches.map(match => ({
    ...match,
    date: new Date(match.date),
  }));

  return (
    <div className={PageContainerStyling}>
      <div className="grid xl:grid-cols-2 gap-4 md:gap-6">
        <Link
          to="/duel"
          className=" hover:bg-blue-700 dark:hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex flex-col items-center"
        >
          <span className="text-2xl md:mb-2 md:text-4xl dark:text-white text-gray-900 mt-2">
            1v1
          </span>
          <img
            src="img/1v1krok.png"
            alt="1v1"
            className="w-1/2 md:w-full rounded"
          />
        </Link>
        <Link
          to="/team"
          className=" hover:bg-blue-700 dark:hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex flex-col items-center"
        >
          <span className="text-2xl md:mb-2 md:text-4xl mt-2 dark:text-white text-gray-900">
            2v2
          </span>
          <img
            src="img/2v2krok.png"
            alt="2v2"
            className="w-1/2 md:w-full rounded"
          />
        </Link>
      </div>
      <div className="p-4">
        <ActivityGraph matches={parsedMatches} />
      </div>
    </div>
  );
}

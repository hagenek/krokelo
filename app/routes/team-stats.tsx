import { useFetcher } from '@remix-run/react';
import { getPlayers } from '~/services/player-service';
import { getTeams, type Team } from '~/services/team-service';
import {
  getRecentTeamMatches,
  revertLatestTeamMatch,
} from '~/services/team-match-service';
import { PageContainerStyling } from './team-duel';
import { BlueBadge, GreenBadge, YellowBadge } from '~/components/badges';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

export const loader = async () => {
  const players = await getPlayers();
  const teams = await getTeams();

  const recentTeamMatches = await getRecentTeamMatches(5);

  return typedjson({ players, teams, recentTeamMatches });
};

export const action = async () => {
  await revertLatestTeamMatch();
  return null;
};

const getBadgeForTopThreeTeam = (teamId: number, topThreeTeams: Team[]) => {
  if (teamId === topThreeTeams[0].id) return <YellowBadge>Rank 1</YellowBadge>;
  if (teamId === topThreeTeams[1].id) return <GreenBadge>Rank 2</GreenBadge>;
  if (teamId === topThreeTeams[2].id) return <BlueBadge>Rank 3</BlueBadge>;

  return null;
};

const isLatestMatch = (idx: number) => idx === 0;

const isMatchLessThan5MinutesOld = (matchDate: Date) => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return matchDate > fiveMinutesAgo;
};

const getRowHighlightClass = (idx: number, matchDate: Date) =>
  isLatestMatch(idx) && isMatchLessThan5MinutesOld(matchDate)
    ? 'bg-slate-100 dark:bg-gray-700'
    : '';

export default function Index() {
  const fetcher = useFetcher();
  const { players, teams, recentTeamMatches } =
    useTypedLoaderData<typeof loader>();

  if (teams.length === 0) {
    return (
      <div className="bg-blue-800 p-8 dark:bg-gray-500 dark:text-white">
        Ingen kamper spilt enda
      </div>
    );
  }

  const teamsSortedOnELODesc = [...teams].sort(
    (t1, t2) => t2.currentELO - t1.currentELO
  );

  const playersSortedOnTeamELODesc = [...players].sort(
    (p1, p2) => p2.currentTeamELO - p1.currentTeamELO
  );

  const topThreeTeams = teamsSortedOnELODesc.slice(0, 3);
  const topFiveTeamPlayers = playersSortedOnTeamELODesc.slice(0, 5);

  return (
    <div className={PageContainerStyling}>
      <section className="py-4">
        <h2 className="mb-3 text-xl font-bold md:text-2xl dark:text-white">
          Nylige kamper
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="w-1/3 py-2">Tidspunkt</th>
                <th className="w-1/3 py-2">Vinner</th>
                <th className="w-1/3 py-2">Taper</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentTeamMatches.map((match, idx) => (
                <tr
                  key={match.id}
                  className={`border-b dark:border-gray-600 ${getRowHighlightClass(idx, match.date)}`}
                >
                  <td className="py-2 dark:text-white">
                    {new Date(match.date).toLocaleString('no-NO', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-2 dark:text-white">
                    <div>
                      {getBadgeForTopThreeTeam(
                        match.winnerTeam.id,
                        topThreeTeams
                      )}
                    </div>
                    <span className="font-semibold">
                      {match.winnerTeam.players
                        .map((player) => player.name)
                        .join(' & ')}
                    </span>
                    <div>
                      <span className="font-medium text-[#00754E] dark:text-[#70C7AA]">
                        {match.winnerTeam.eloAfterMatch}
                      </span>
                      {` (+${match.winnerTeam.eloDifference}) `}
                    </div>
                  </td>
                  <td className="py-2 dark:text-white">
                    <div>
                      {getBadgeForTopThreeTeam(
                        match.loserTeam.id,
                        topThreeTeams
                      )}
                    </div>
                    <span className="font-semibold">
                      {match.loserTeam.players
                        .map((player) => player.name)
                        .join(' & ')}
                    </span>
                    <div>
                      <span className="font-medium text-[#E44244] dark:text-[#EC7B7C]">
                        {match.loserTeam.eloAfterMatch}
                      </span>
                      {` (-${match.loserTeam.eloDifference}) `}
                    </div>
                  </td>
                  <td>
                    {isLatestMatch(idx) &&
                      isMatchLessThan5MinutesOld(match.date) && (
                        <button
                          onClick={() => fetcher.submit({}, { method: 'post' })}
                          className="mx-4 rounded bg-blue-600 px-2 py-1 font-bold text-white hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-800"
                        >
                          Angre
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-4">
        <h2 className="mb-3 text-xl font-bold md:text-2xl dark:text-white">
          Individuell ranking ved lagspill top 5
        </h2>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="w-2/5 py-2 dark:text-white">Navn</th>
              <th className="w-1/5 py-2 dark:text-white">Seiere</th>
              <th className="w-1/5 py-2 dark:text-white">Tap</th>
              <th className="w-1/5 py-2 dark:text-white">ELO</th>
            </tr>
          </thead>
          <tbody>
            {topFiveTeamPlayers.map((player) => (
              <tr
                key={player.id}
                className="text-md border-t md:text-xl dark:border-gray-700"
              >
                <td className="py-2 font-semibold dark:text-white">
                  {player.name}
                </td>
                <td className="py-2 dark:text-white">
                  {player.teams.reduce(
                    (teamMatchesWins, team) =>
                      teamMatchesWins + team.teamMatchesAsWinner.length,
                    0
                  )}
                </td>
                <td className="py-2 dark:text-white">
                  {player.teams.reduce(
                    (teamMatchesLosses, team) =>
                      teamMatchesLosses + team.teamMatchesAsLoser.length,
                    0
                  )}
                </td>
                <td className="py-2 dark:text-white">
                  {player.currentTeamELO}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="py-4">
        <h2 className="mb-3 text-xl font-bold md:text-2xl dark:text-white">
          Lagranking
        </h2>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="w-2/5 py-2 dark:text-white">Navn</th>
              <th className="w-1/5 py-2 dark:text-white">Seiere</th>
              <th className="w-1/5 py-2 dark:text-white">Tap</th>
              <th className="w-1/5 py-2 dark:text-white">ELO</th>
            </tr>
          </thead>

          <tbody>
            {teamsSortedOnELODesc.map((team) => (
              <tr key={team.id} className="border-t dark:border-gray-700">
                <td className="py-2 font-semibold dark:text-white">
                  {team.players.map((player) => player.name).join(' & ')}
                </td>
                <td className="py-2 dark:text-white">{team.wins}</td>
                <td className="py-2 dark:text-white">{team.losses}</td>
                <td className="py-2 dark:text-white">{team.currentELO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

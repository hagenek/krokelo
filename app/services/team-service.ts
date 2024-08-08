import EloRank from 'elo-rank';
import { prisma } from '../prisma-client';
import { Prisma } from '@prisma/client';
import { updatePlayerTeamELO } from './player-service';
import { K_FACTOR } from '~/utils/constants';

const elo = new EloRank(K_FACTOR);

export type Teams = Prisma.PromiseReturnType<typeof getTeams>;

export type Team = Teams[0];

export const getTeams = async () => {
  const teams = await prisma.team.findMany({
    include: {
      players: true,
      teamMatchesAsWinner: true,
      teamMatchesAsLoser: true,
      TeamELOLog: {
        orderBy: {
          date: 'desc',
        },
      },
    },
  });

  const enhancedTeams = teams.map((team) => {
    const wins = team.teamMatchesAsWinner.length;
    const losses = team.teamMatchesAsLoser.length;
    const totalMatches = wins + losses;
    const name = team.players[0].name + ' & ' + team.players[1].name;
    // Assuming the team's current ELO is the latest entry in the ELO log
    const currentELO =
      team.TeamELOLog.length > 0 ? team.TeamELOLog[0].elo : team.currentELO;

    return {
      ...team,
      wins,
      losses,
      totalMatches,
      currentELO,
      name,
    };
  });

  return enhancedTeams;
};

export const createTeam = async (player1Id: number, player2Id: number) => {
  // First, try to find a team that includes both players
  const existingTeam = await prisma.team.findFirst({
    where: {
      players: {
        every: {
          OR: [{ id: player1Id }, { id: player2Id }],
        },
      },
    },
    include: {
      players: true, // Include players in the response
    },
  });

  // If such a team exists, return it
  if (existingTeam) {
    return existingTeam;
  }

  // If not, create a new team with these players
  return await prisma.team.create({
    data: {
      players: {
        connect: [{ id: player1Id }, { id: player2Id }],
      },
    },
    include: {
      players: true, // Include players in the response
    },
  });
};

// Calculate new ELOs for team matches
export const calculateNewTeamELOs = (
  currentELOTeam1: number,
  currentELOTeam2: number,
  team1IsWinner: boolean
) => {
  const team1Score = team1IsWinner ? 1 : 0;
  const team2Score = team1IsWinner ? 0 : 1;

  const expectedScoreTeam1 = elo.getExpected(currentELOTeam1, currentELOTeam2);
  const expectedScoreTeam2 = elo.getExpected(currentELOTeam2, currentELOTeam1);

  const newELOTeam1 = elo.updateRating(
    expectedScoreTeam1,
    team1Score,
    currentELOTeam1
  );
  const newELOTeam2 = elo.updateRating(
    expectedScoreTeam2,
    team2Score,
    currentELOTeam2
  );

  return {
    newELOTeam1,
    newELOTeam2,
  };
};

const logTeamPlayerELO = async (
  playerId: number,
  elo: number,
  matchId: number
) => {
  await prisma.teamPlayerELOLog.create({
    data: {
      playerId,
      elo,
      teamMatchId: matchId,
    },
  });
};

const logTeamELO = async (teamId: number, elo: number, matchId: number) => {
  await prisma.teamELOLog.create({
    data: {
      teamId,
      elo,
      teamMatchId: matchId,
    },
  });
};

const updateTeamELO = async (teamId: number, newElo: number) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (team)
    [
      await prisma.team.update({
        where: { id: teamId },
        data: {
          previousELO: team.currentELO,
          currentELO: newElo,
        },
      }),
    ];
};

type UpdateELOsTeamPlayInput = {
  teamData: {
    team1Id: number;
    team2Id: number;
    newELOTeam1: number;
    newELOTeam2: number;
  };
  playerData: {
    player1Id: number;
    player2Id: number;
    player3Id: number;
    player4Id: number;
    newELOPlayer1: number;
    newELOPlayer2: number;
    newELOPlayer3: number;
    newELOPlayer4: number;
  };
  matchId: number;
};

export async function updateAndLogELOsTeamPlay({
  teamData: { team1Id, team2Id, newELOTeam1, newELOTeam2 },
  playerData: {
    player1Id,
    player2Id,
    player3Id,
    player4Id,
    newELOPlayer1,
    newELOPlayer2,
    newELOPlayer3,
    newELOPlayer4,
  },
  matchId,
}: UpdateELOsTeamPlayInput) {
  await updateTeamELO(team1Id, newELOTeam1);
  await updateTeamELO(team2Id, newELOTeam2);

  await logTeamELO(team1Id, newELOTeam1, matchId);
  await logTeamELO(team2Id, newELOTeam2, matchId);

  await updatePlayerTeamELO(player1Id, newELOPlayer1);
  await updatePlayerTeamELO(player2Id, newELOPlayer2);
  await updatePlayerTeamELO(player3Id, newELOPlayer3);
  await updatePlayerTeamELO(player4Id, newELOPlayer4);

  await logTeamPlayerELO(player1Id, newELOPlayer1, matchId);
  await logTeamPlayerELO(player2Id, newELOPlayer2, matchId);
  await logTeamPlayerELO(player3Id, newELOPlayer3, matchId);
  await logTeamPlayerELO(player4Id, newELOPlayer4, matchId);
}

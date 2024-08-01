import EloRank from 'elo-rank';
import { prisma } from '../prisma-client';
import { Prisma } from '@prisma/client';
import { updatePlayerTeamELO } from './player-service';
import { BASE_ELO, K_FACTOR } from '~/utils/constants';

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

export const getRecentTeamMatches = async (limit: number = 5) => {
  const recentMatches = await prisma.teamMatch.findMany({
    take: limit,
    orderBy: { date: 'desc' },
    include: {
      winnerTeam: { include: { players: true } },
      loserTeam: { include: { players: true } },
    },
  });

  const matchesWithELO = await Promise.all(
    recentMatches.map(async (match) => {
      // Fetch ELO for the winner team
      const winnerELOLog = await prisma.teamELOLog.findFirst({
        where: {
          teamMatchId: match.id,
          teamId: match.winnerTeamId,
        },
      });

      // Fetch ELO for the loser team
      const loserELOLog = await prisma.teamELOLog.findFirst({
        where: {
          teamMatchId: match.id,
          teamId: match.loserTeamId,
        },
      });

      return {
        date: match.date,
        winner: {
          teamId: match.winnerTeamId,
          teamName: match.winnerTeam.players
            .map((player) => player.name)
            .join(' & '),
          players: match.winnerTeam.players,
          elo: winnerELOLog ? winnerELOLog.elo : null, // Assuming null if no ELO log found
        },
        loser: {
          teamId: match.loserTeamId,
          teamName: match.loserTeam.players
            .map((player) => player.name)
            .join(' & '),
          players: match.loserTeam.players,
          elo: loserELOLog ? loserELOLog.elo : null, // Assuming null if no ELO log found
        },
      };
    })
  );

  return matchesWithELO;
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

// Record a team match and update ELO for both teams
export const recordTeamMatch = async (
  winnerTeamId: number,
  loserTeamId: number,
  winnerELO: number,
  loserELO: number
) => {
  return await prisma.teamMatch.create({
    data: {
      winnerTeamId,
      loserTeamId,
      winnerELO,
      loserELO,
    },
  });
};

export const revertLatestTeamMatch = async () => {
  try {
    // Step 1: Find the latest match
    const latestMatch = await prisma.teamMatch.findFirst({
      orderBy: {
        date: 'desc',
      },
    });

    if (!latestMatch) {
      console.error('No matches found to revert.');
      return;
    }

    const teamELOLogs = await prisma.teamELOLog.findMany({
      where: {
        teamMatchId: latestMatch.id,
      },
    });

    // Step 2: Fetch the ELO logs immediately preceding the latest match for teams
    // Note: This assumes there's a previousELO field in the Team model.
    for (const log of teamELOLogs) {
      const previousLog = await prisma.teamELOLog.findFirst({
        where: {
          teamId: log.teamId,
          date: {
            lt: log.date,
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      if (previousLog) {
        await prisma.team.update({
          where: { id: log.teamId },
          data: { currentELO: previousLog.elo },
        });
      } else {
        // Handle the case where there's no previous log
        // Example: Reset to default ELO
        await prisma.team.update({
          where: { id: log.teamId },
          data: { currentELO: BASE_ELO }, // Or any default/fallback value
        });
      }
    }

    const playerELOLogs = await prisma.teamPlayerELOLog.findMany({
      where: {
        teamMatchId: latestMatch.id,
      },
    });

    // Step 3: Fetch the ELO logs immediately preceding the latest match for players
    // Note: This assumes there's a previousTeamELO field in the Player model.
    for (const log of playerELOLogs) {
      const previousLog = await prisma.teamPlayerELOLog.findFirst({
        where: {
          playerId: log.playerId,
          date: {
            lt: log.date,
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      if (previousLog) {
        await prisma.player.update({
          where: { id: log.playerId },
          data: { currentTeamELO: previousLog.elo },
        });
      } else {
        // Handle the case where there's no previous log
        await prisma.player.update({
          where: { id: log.playerId },
          data: { currentTeamELO: BASE_ELO }, // Or any default/fallback value
        });
      }
    }

    // Step 4: Delete ELO logs
    await prisma.teamELOLog.deleteMany({
      where: {
        teamMatchId: latestMatch.id,
      },
    });

    await prisma.teamPlayerELOLog.deleteMany({
      where: {
        teamMatchId: latestMatch.id,
      },
    });

    // Step 5: Delete the match record
    await prisma.teamMatch.delete({
      where: {
        id: latestMatch.id,
      },
    });

    console.log(
      'Latest match and associated ELO changes successfully reverted.'
    );
  } catch (error) {
    console.error('Error in reverting the latest match:', error);
  }
};

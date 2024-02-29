import EloRank from 'elo-rank';
import { prisma } from '../prisma-client';
import { Prisma } from '@prisma/client';

const elo = new EloRank(100);

export type Player = Prisma.PlayerGetPayload<{
  include: { matchesAsWinner: true; matchesAsLoser: true; eloLogs: true };
}>;

export const getPlayers = async (): Promise<Player[]> => {
  const players = await prisma.player.findMany({
    include: {
      matchesAsWinner: {
        orderBy: {
          date: 'desc',
        },
      },
      matchesAsLoser: {
        orderBy: {
          date: 'desc',
        },
      },
      eloLogs: true,
    },
  });
  players;
  return players;
};

export const createPlayer = async (name: string) => {
  return await prisma.player.create({
    data: {
      name,
      currentELO: 1500,
      currentTeamELO: 1500,
    },
  });
};

export const findPlayerByName = async (name: string) => {
  return await prisma.player.findUnique({
    where: {
      name,
    },
  });
};

export const logIndividualELO = async (
  playerId: number,
  elo: number,
  matchId: number
) => {
  await prisma.eLOLog.create({
    data: {
      playerId,
      elo,
      matchId,
    },
  });
};

export const calculateNewELOs = (
  currentELOPlayer1: number,
  currentELOPlayer2: number,
  player1IsWinner: boolean
) => {
  const player1Score = player1IsWinner ? 1 : 0;
  const player2Score = player1IsWinner ? 0 : 1;

  const expectedScorePlayer1 = elo.getExpected(
    currentELOPlayer1,
    currentELOPlayer2
  );
  const expectedScorePlayer2 = elo.getExpected(
    currentELOPlayer2,
    currentELOPlayer1
  );

  const newELOPlayer1 = elo.updateRating(
    expectedScorePlayer1,
    player1Score,
    currentELOPlayer1
  );
  const newELOPlayer2 = elo.updateRating(
    expectedScorePlayer2,
    player2Score,
    currentELOPlayer2
  );

  return {
    newELOPlayer1,
    newELOPlayer2,
  };
};

export const calculatePlayerWinStreak = (player: Player): number => {
  const lastLossDate = player.matchesAsLoser[0]?.date;
  return lastLossDate
    ? player.matchesAsWinner.filter((match) => match.date > lastLossDate).length
    : player.matchesAsWinner.length;
};

export const recordMatch = async (
  winnerId: number,
  loserId: number,
  winnerELO: number,
  loserELO: number
) => {
  return await prisma.match.create({
    data: {
      winnerId,
      loserId,
      winnerELO,
      loserELO,
    },
  });
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

export const calculateNewIndividualELOs = (
  eloPlayer1Team1: number,
  eloPlayer2Team1: number,
  eloPlayer1Team2: number,
  eloPlayer2Team2: number,
  team1IsWinner: boolean
) => {
  const averageEloTeam1 = (eloPlayer1Team1 + eloPlayer2Team1) / 2;
  const averageEloTeam2 = (eloPlayer1Team2 + eloPlayer2Team2) / 2;

  console.log(
    `Average ELOs: Team 1: ${averageEloTeam1}, Team 2: ${averageEloTeam2}`
  );

  const player1Team1Score = team1IsWinner ? 1 : 0;
  const player2Team1Score = team1IsWinner ? 1 : 0;
  const player1Team2Score = team1IsWinner ? 0 : 1;
  const player2Team2Score = team1IsWinner ? 0 : 1;

  console.log(
    `Scores: Team 1 - Player 1: ${player1Team1Score}, Player 2: ${player2Team1Score}; Team 2 - Player 1: ${player1Team2Score}, Player 2: ${player2Team2Score}`
  );

  const newELOPlayer1Team1 = elo.updateRating(
    elo.getExpected(averageEloTeam1, averageEloTeam2),
    player1Team1Score,
    eloPlayer1Team1
  );
  const newELOPlayer2Team1 = elo.updateRating(
    elo.getExpected(averageEloTeam1, averageEloTeam2),
    player2Team1Score,
    eloPlayer2Team1
  );
  const newELOPlayer1Team2 = elo.updateRating(
    elo.getExpected(averageEloTeam2, averageEloTeam1),
    player1Team2Score,
    eloPlayer1Team2
  );
  const newELOPlayer2Team2 = elo.updateRating(
    elo.getExpected(averageEloTeam2, averageEloTeam1),
    player2Team2Score,
    eloPlayer2Team2
  );

  console.log(
    `New ELOs: Team 1 - Player 1: ${newELOPlayer1Team1}, Player 2: ${newELOPlayer2Team1}; Team 2 - Player 1: ${newELOPlayer1Team2}, Player 2: ${newELOPlayer2Team2}`
  );

  return {
    newELOPlayer1Team1,
    newELOPlayer2Team1,
    newELOPlayer1Team2,
    newELOPlayer2Team2,
  };
};

export type Match = Prisma.MatchGetPayload;

export type RecentMatch = Prisma.MatchGetPayload<{
  include: { winner: true; loser: true };
}>;

export const getRecent1v1Matches = async (
  limit: number = 5
): Promise<RecentMatch[]> => {
  return await prisma.match.findMany({
    take: limit,
    orderBy: {
      date: 'desc',
    },
    include: {
      winner: true,
      loser: true,
    },
  });
};

export const updateELO = async (playerId: number, newELO: number) => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (player) {
    await prisma.player.update({
      where: { id: playerId },
      data: {
        previousELO: player.currentELO,
        currentELO: newELO,
      },
    });
  }
};

export const updatePlayerTeamELO = async (playerId: number, newELO: number) => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (player) {
    await prisma.player.update({
      where: { id: playerId },
      data: {
        previousTeamELO: player.currentTeamELO,
        currentTeamELO: newELO,
      },
    });
  }
};

export async function getPlayerELOHistory(playerId: number) {
  return prisma.eLOLog.findMany({
    where: { playerId },
    orderBy: { date: 'asc' },
  });
}

export async function getPlayerTeamELOHistory(playerId: number) {
  return prisma.teamPlayerELOLog.findMany({
    where: { playerId },
    orderBy: { date: 'asc' },
  });
}

export const getPlayerDetails = async (playerId: number) => {
  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
    include: {
      matchesAsWinner: {
        select: {
          id: true,
          date: true,
          winnerELO: true,
          loser: {
            select: {
              name: true,
            },
          },
        },
      },
      matchesAsLoser: {
        select: {
          id: true,
          date: true,
          loserELO: true,
          winner: {
            select: {
              name: true,
            },
          },
        },
      },
      eloLogs: {
        orderBy: {
          date: 'asc',
        },
      },
    },
  });

  if (!player) {
    throw new Error(`Player with ID ${playerId} not found`);
  }

  return player;
};

export const revertLatestMatch = async () => {
  try {
    // Step 1: Find the latest 1v1 player match
    const latestMatch = await prisma.match.findFirst({
      orderBy: {
        date: 'desc',
      },
    });

    if (!latestMatch) {
      console.error('No 1v1 matches found to revert.');
      return;
    }

    // Step 2: Fetch the ELO logs immediately preceding the latest match for both players
    for (const playerId of [latestMatch.winnerId, latestMatch.loserId]) {
      const previousLog = await prisma.eLOLog.findFirst({
        where: {
          playerId: playerId,
          date: {
            lt: latestMatch.date,
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      if (previousLog) {
        await prisma.player.update({
          where: { id: playerId },
          data: { currentELO: previousLog.elo },
        });
      } else {
        await prisma.player.update({
          where: { id: playerId },
          data: { currentELO: 1500 },
        });
      }
    }

    // Step 3: Delete ELO logs related to the match
    await prisma.eLOLog.deleteMany({
      where: {
        matchId: latestMatch.id,
      },
    });

    // Step 4: Delete the match record
    await prisma.match.delete({
      where: {
        id: latestMatch.id,
      },
    });

    console.log(
      'Latest 1v1 match and associated ELO changes successfully reverted.'
    );
  } catch (error) {
    console.error('Error in reverting the latest 1v1 match:', error);
  }
};

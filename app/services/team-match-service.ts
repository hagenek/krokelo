import { prisma } from '../prisma-client';
import { Prisma } from '@prisma/client';
import { BASE_ELO } from '~/utils/constants';

type TeamMatchWithTeams = Prisma.TeamMatchGetPayload<{
  include: {
    winnerTeam: {
      include: {
        players: true;
        TeamELOLog: true;
      };
    };
    loserTeam: {
      include: {
        players: true;
        TeamELOLog: true;
      };
    };
  };
}>;

type RecentTeamMatchTeam = Prisma.TeamGetPayload<{
  include: {
    players: true;
    TeamELOLog: true;
  };
}>;

export const getDatesFromTeamMatchesLastSevenDays = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);

  return prisma.teamMatch.findMany({
    where: {
      date: {
        gte: sevenDaysAgo,
      },
    },
    select: { id: true, date: true },
  });
};

const calculateTeamEloValuesFromMatch = (
  team: RecentTeamMatchTeam,
  match: TeamMatchWithTeams
) => {
  const currentMatchEloIndex = team.TeamELOLog.findIndex(
    (log) => log.teamMatchId === match.id
  );
  const formerMatchEloIndex = currentMatchEloIndex + 1;

  const currentMatchElo = team.TeamELOLog[currentMatchEloIndex].elo;
  const formerMatchElo =
    formerMatchEloIndex === team.TeamELOLog.length
      ? BASE_ELO // Use BASE_ELO when there is no former match
      : team.TeamELOLog[formerMatchEloIndex].elo;

  return {
    eloAfterMatch: currentMatchElo,
    eloDifference: Math.abs(currentMatchElo - formerMatchElo),
  };
};

export const getRecentTeamMatches = async (limit: number = 5) => {
  const recentTeamMatches = await prisma.teamMatch.findMany({
    take: limit,
    orderBy: { date: 'desc' },
    include: {
      winnerTeam: {
        include: { players: true, TeamELOLog: { orderBy: { date: 'desc' } } },
      },
      loserTeam: {
        include: { players: true, TeamELOLog: { orderBy: { date: 'desc' } } },
      },
    },
  });

  return recentTeamMatches.map((match) => ({
    ...match,
    winnerTeam: {
      ...match.winnerTeam,
      ...calculateTeamEloValuesFromMatch(match.winnerTeam, match),
    },
    loserTeam: {
      ...match.loserTeam,
      ...calculateTeamEloValuesFromMatch(match.loserTeam, match),
    },
  }));
};

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

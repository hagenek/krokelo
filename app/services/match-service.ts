import { prisma } from '../prisma-client';
import { Prisma } from '@prisma/client';
import { BASE_ELO } from '~/utils/constants';

type Recent1v1MatchWithPlayers = Prisma.MatchGetPayload<{
  include: {
    winner: {
      include: {
        eloLogs: true;
      };
    };
    loser: {
      include: {
        eloLogs: true;
      };
    };
  };
}>;

type Recent1v1MatchPlayer = Prisma.PlayerGetPayload<{
  include: {
    eloLogs: true;
  };
}>;

export const getDatesFrom1v1MatchesLastSevenDays = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);

  return prisma.match.findMany({
    where: {
      date: {
        gte: sevenDaysAgo,
      },
    },
    select: { id: true, date: true },
  });
};

const calculatePlayerEloValuesFromMatch = (
  player: Recent1v1MatchPlayer,
  match: Recent1v1MatchWithPlayers
) => {
  const currentMatchEloIndex = player.eloLogs.findIndex(
    (log) => log.matchId === match.id
  );
  const formerMatchEloIndex = currentMatchEloIndex + 1;

  const currentMatchElo = player.eloLogs[currentMatchEloIndex].elo;
  const formerMatchElo =
    formerMatchEloIndex === player.eloLogs.length
      ? BASE_ELO // Use BASE_ELO when there is no former match
      : player.eloLogs[formerMatchEloIndex].elo;

  return {
    eloAfterMatch: currentMatchElo,
    eloDifference: Math.abs(currentMatchElo - formerMatchElo),
  };
};

export const getRecent1v1Matches = async (limit: number = 5) => {
  const recent1v1Matches = await prisma.match.findMany({
    take: limit,
    orderBy: {
      date: 'desc',
    },
    include: {
      winner: {
        include: {
          eloLogs: { orderBy: { date: 'desc' } },
        },
      },
      loser: {
        include: {
          eloLogs: { orderBy: { date: 'desc' } },
        },
      },
    },
  });

  return recent1v1Matches.map((match) => ({
    ...match,
    winner: {
      ...match.winner,
      ...calculatePlayerEloValuesFromMatch(match.winner, match),
    },
    loser: {
      ...match.loser,
      ...calculatePlayerEloValuesFromMatch(match.loser, match),
    },
  }));
};

export const record1v1Match = async (
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

export const revertLatest1v1Match = async () => {
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
          data: { currentELO: BASE_ELO },
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

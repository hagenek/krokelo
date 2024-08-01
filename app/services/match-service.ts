import { prisma } from '../prisma-client';
import { Prisma, type Player } from '@prisma/client';
import { BASE_ELO } from '~/utils/constants';

export type MatchesMinimal = Prisma.PromiseReturnType<
  typeof getMatchesLastSevenDays
>;

export const getMatchesLastSevenDays = async () => {
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

export type RecentMatches = Prisma.PromiseReturnType<
  typeof getRecent1v1Matches
>;

export type RecentMatch = RecentMatches[0];

export type RecentMatchPlayer = Player;

export const getRecent1v1Matches = async (limit: number = 5) => {
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

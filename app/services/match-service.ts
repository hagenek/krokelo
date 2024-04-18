import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

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

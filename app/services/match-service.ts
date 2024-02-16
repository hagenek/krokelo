import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface MatchMinimal {
  id: number;
  date: Date;
}

export const getMatchesLastSevenDays = async (): Promise<MatchMinimal[]> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return prisma.match.findMany({
    where: {
      date: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      id: true,
      date: true,
    },
  });
};

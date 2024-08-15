import EloRank from 'elo-rank';
import { prisma } from '../prisma-client';
import { Prisma } from '@prisma/client';
import { BASE_ELO, K_FACTOR } from '~/utils/constants';

const elo = new EloRank(K_FACTOR);

export type Player = Prisma.PromiseReturnType<typeof createPlayer>;

export type PlayersWithStats = Prisma.PromiseReturnType<typeof getPlayers>;

export type PlayerWithStats = PlayersWithStats[0];

export type PlayerWithMatches = Prisma.PlayerGetPayload<{
  include: {
    matchesAsWinner: true;
    matchesAsLoser: true;
    eloLogs: true;
    teamPlayerELOLog: true;
    teams: {
      include: {
        teamMatchesAsWinner: true;
        teamMatchesAsLoser: true;
      };
    };
  };
}>;

export const getPlayers = async () => {
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
      eloLogs: {
        orderBy: {
          date: 'desc',
        },
      },
      teamPlayerELOLog: {
        orderBy: {
          date: 'desc',
        },
      },
      teams: {
        include: {
          teamMatchesAsWinner: true,
          teamMatchesAsLoser: true,
        },
      },
    },
  });

  return players.map((player) => ({
    ...player,
    winStreak: calculatePlayerWinStreak(player),
  }));
};

const calculatePlayerWinStreak = (player: PlayerWithMatches) => {
  const lastLossDate = player.matchesAsLoser[0]?.date;
  return lastLossDate
    ? player.matchesAsWinner.filter((match) => match.date > lastLossDate).length
    : player.matchesAsWinner.length;
};

export const createPlayer = async (name: string) => {
  return await prisma.player.create({
    data: {
      name,
      currentELO: BASE_ELO,
      currentTeamELO: BASE_ELO,
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

export const updatePlayerELO = async (playerId: number, newELO: number) => {
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

export const updatePlayerStatus = async (playerId: number, status: boolean) => {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
  });

  if (player) {
    await prisma.player.update({
      where: { id: playerId },
      data: {
        inactive: status,
      },
    });
  }
};

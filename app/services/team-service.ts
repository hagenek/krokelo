import { Player, Team } from "@prisma/client";
import { prisma } from "../prisma-client"
import { updatePlayerTeamELO } from "./player-service";

// Function to calculate the number of wins for a team
export const calculateTeamWins = async (teamId: number) => {
  const wins = await prisma.teamMatch.count({
    where: {
      winnerTeamId: teamId,
    },
  });
  return wins;
};

interface Player {
  id: number;
  name: string;
  currentELO: number;
  currentTeamELO: number;
  previousELO: number | null;
  previousTeamELO: number;
}

interface TeamMatch {
  id: number;
  date: string; // or Date if you prefer to work with Date objects
  winnerTeamId: number;
  loserTeamId: number;
  winnerELO: number;
  loserELO: number;
}

interface TeamELOLog {
  id: number;
  elo: number;
  date: string; // or Date if you prefer to work with Date objects
  teamId: number;
  teamMatchId: number;
}

interface Team {
  id: number;
  currentELO: number;
  previousELO: number;
  players: Player[];
  teamMatchesAsWinner: TeamMatch[];
  teamMatchesAsLoser: TeamMatch[];
  TeamELOLog: TeamELOLog[];
  wins: number;
  losses: number;
  totalMatches: number;
  name: string;
}

export const getTeams = async () => {
  const teams = await prisma.team.findMany({
    include: {
      players: true,
      teamMatchesAsWinner: true,
      teamMatchesAsLoser: true,
      TeamELOLog: true,
    }
  });

  const enhancedTeams = teams.map(team => {
    const wins = team.teamMatchesAsWinner.length;
    const losses = team.teamMatchesAsLoser.length;
    const totalMatches = wins + losses;
    const name = team.players[0].name + " & " + team.players[1].name
    // Assuming the team's current ELO is the last entry in the ELO log
    const currentELO = team.TeamELOLog.length > 0 ? team.TeamELOLog[team.TeamELOLog.length - 1].elo : team.currentELO;

    return {
      ...team,
      wins,
      losses,
      totalMatches,
      currentELO,
      name
    };
  });

  return enhancedTeams;
};


export const calculateTeamLosses = async (teamId: number) => {
  const losses = await prisma.teamMatch.count({
    where: {
      loserTeamId: teamId,
    },
  });
  return losses;
};

export const calculateTotalMatches = async (teamId: number) => {
  const wins = await calculateTeamWins(teamId);
  const losses = await calculateTeamLosses(teamId);
  return wins + losses;
};

type PlayerTeamStats = {
  totalMatches: number;
  wins: number;
  losses: number;
};

async function getPlayerTeamMatchStats(playerId: number): Promise<PlayerTeamStats> {
  // Find the teams that the player is a part of
  const playerTeams = await prisma.player.findUnique({
    where: { id: playerId },
    include: { teams: true }
  });

  if (!playerTeams || !playerTeams.teams) {
    return { totalMatches: 0, wins: 0, losses: 0 };
  }

  let totalMatches = 0;
  let totalWins = 0;
  let totalLosses = 0;

  // Iterate over each team and count matches, wins, and losses
  for (const team of playerTeams.teams) {
    const teamMatches = await prisma.teamMatch.findMany({
      where: {
        OR: [
          { winnerTeamId: team.id },
          { loserTeamId: team.id }
        ]
      }
    });

    totalMatches += teamMatches.length;

    // Count wins and losses
    teamMatches.forEach(match => {
      if (match.winnerTeamId === team.id) {
        totalWins++;
      } else {
        totalLosses++;
      }
    });
  }

  // Return the statistics
  return { totalMatches, wins: totalWins, losses: totalLosses }
}

export type TeamMatchStats = {
  [key: number]: PlayerTeamStats
}

export async function getMultiplePlayerTeamMatchStats(playerIds: number[]): Promise<TeamMatchStats> {
  const stats: TeamMatchStats = {};

  for (const playerId of playerIds) {
    stats[playerId] = await getPlayerTeamMatchStats(playerId)
  }

  return stats;
}

interface TeamMatchDetail {
  date: Date;
  winner: {
    teamId: number;
    teamName: string;
    players: Player[];
    elo: number | null;
  };
  loser: {
    teamId: number;
    teamName: string;
    players: Player[];
    elo: number | null;
  };
}

export type TeamMatchDetails = TeamMatchDetail[];

export const getRecentTeamMatches = async (limit: number = 5) => {
  const recentMatches = await prisma.teamMatch.findMany({
    take: limit,
    orderBy: { date: 'desc' },
    include: {
      winnerTeam: { include: { players: true } },
      loserTeam: { include: { players: true } }
    }
  });

  const matchesWithELO = await Promise.all(recentMatches.map(async match => {
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
        teamName: match.winnerTeam.players.map(player => player.name).join(' & '),
        players: match.winnerTeam.players,
        elo: winnerELOLog ? winnerELOLog.elo : null // Assuming null if no ELO log found
      },
      loser: {
        teamId: match.loserTeamId,
        teamName: match.loserTeam.players.map(player => player.name).join(' & '),
        players: match.loserTeam.players,
        elo: loserELOLog ? loserELOLog.elo : null // Assuming null if no ELO log found
      }
    };
  }));

  return matchesWithELO;
};

const logTeamPlayerELO = async (playerId: number, elo: number, matchId: number) => {
  await prisma.teamPlayerELOLog.create({
    data: {
      playerId,
      elo,
      teamMatchId: matchId
    }
  });
};

const logTeamELO = async (teamId: number, elo: number, matchId: number) => {
  await prisma.teamELOLog.create({
    data: {
      teamId,
      elo,
      teamMatchId: matchId
    }
  });
};

const updateTeamELO = async (teamId: number, newElo: number) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  })

  if (team) [
    await prisma.team.update({
      where: { id: teamId },
      data: {
        previousELO: team.currentELO,
        currentELO: newElo
      },
    })
  ]
}


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
  playerData: { player1Id, player2Id, player3Id, player4Id, newELOPlayer1, newELOPlayer2, newELOPlayer3, newELOPlayer4 },
  matchId
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
export const recordTeamMatch = async (winnerTeamId: number, loserTeamId: number, winnerELO: number, loserELO: number) => {
  return await prisma.teamMatch.create({
    data: {
      winnerTeamId,
      loserTeamId,
      winnerELO,
      loserELO
    }
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
      console.error("No matches found to revert.");
      return;
    }

    const teamELOLogs = await prisma.teamELOLog.findMany(
      {
        where: {
          teamMatchId: latestMatch.id,
        },
      }
    )

    // Step 2: Fetch the ELO logs immediately preceding the latest match for teams
    // Note: This assumes there's a previousELO field in the Team model.
    for (const log of teamELOLogs) {
      const previousLog = await prisma.teamELOLog.findFirst({
        where: {
          teamId: log.teamId,
          date: {
            lt: log.date
          }
        },
        orderBy: {
          date: 'desc'
        }
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
          data: { currentELO: 1500 }, // Or any default/fallback value
        });
      }
    }

    const playerELOLogs = await prisma.teamPlayerELOLog.findMany(
      {
        where: {
          teamMatchId: latestMatch.id,
        },
      }
    )

    // Step 3: Fetch the ELO logs immediately preceding the latest match for players
    // Note: This assumes there's a previousTeamELO field in the Player model.
    for (const log of playerELOLogs) {
      const previousLog = await prisma.teamPlayerELOLog.findFirst({
        where: {
          playerId: log.playerId,
          date: {
            lt: log.date
          }
        },
        orderBy: {
          date: 'desc'
        }
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
          data: { currentTeamELO: 1500 }, // Or any default/fallback value
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

    console.log("Latest match and associated ELO changes successfully reverted.");

  } catch (error) {
    console.error("Error in reverting the latest match:", error);
  }
};

export const getTeamDetails = async (teamId: number) => {
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      teamMatchesAsWinner: {
        select: {
          id: true,
          date: true,
          winnerELO: true,
          loserTeam: {
            select: {
              id: true,
            }
          }
        },
      },
      teamMatchesAsLoser: {
        select: {
          id: true,
          date: true,
          loserELO: true,
          winnerTeam: {
            select: {
              id: true,
            }
          }
        },
      },
      TeamELOLog: {
        orderBy: {
          date: 'asc',
        },
      },
    },
  });

  if (!team) {
    throw new Error(`Team with ID ${teamId} not found`);
  }

  return team;
};

export async function getTeamELOHistory(teamId: number) {
  return prisma.teamELOLog.findMany({
    where: { teamId },
    orderBy: { date: 'asc' },
  });
}
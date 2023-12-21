import { Player, Team } from "@prisma/client";
import { prisma } from "../prismaClient"

// Function to calculate the number of wins for a team
export const calculateTeamWins = async (teamId: number) => {
    const wins = await prisma.teamMatch.count({
        where: {
            winnerTeamId: teamId,
        },
    });
    return wins;
};

export const getTeams = async () => {
    const teams = await prisma.team.findMany({
        include: {
            players: true, // Include players in each team
            teamMatchesAsWinner: true, // Include matches where the team is the winner
            teamMatchesAsLoser: true, // Include matches where the team is the loser
            TeamELOLog: true, // Include ELO logs for the team
        }
    });

    // Optional: If you want to enhance the team object with calculated fields
    const enhancedTeams = teams.map(team => {
        const wins = team.teamMatchesAsWinner.length;
        const losses = team.teamMatchesAsLoser.length;
        const totalMatches = wins + losses;

        // Assuming the team's current ELO is the last entry in the ELO log
        const currentELO = team.TeamELOLog.length > 0 ? team.TeamELOLog[team.TeamELOLog.length - 1].elo : team.currentELO;

        return {
            ...team,
            wins,
            losses,
            totalMatches,
            currentELO
        };
    });

    return enhancedTeams;
};


// Function to calculate the number of losses for a team
export const calculateTeamLosses = async (teamId: number) => {
    const losses = await prisma.teamMatch.count({
        where: {
            loserTeamId: teamId,
        },
    });
    return losses;
};

// Function to calculate the total number of matches for a team
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
  
  export async function getMultiplePlayerTeamMatchStats(playerIds: number[]): Promise<TeamMatchStats>  {
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
                teamId: match.winnerTeamId,
                date: { lte: match.date }
            },
            orderBy: { date: 'desc' }
        });

        // Fetch ELO for the loser team
        const loserELOLog = await prisma.teamELOLog.findFirst({
            where: {
                teamId: match.loserTeamId,
                date: { lte: match.date }
            },
            orderBy: { date: 'desc' }
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

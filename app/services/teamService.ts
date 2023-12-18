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
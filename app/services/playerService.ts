import EloRank from 'elo-rank';
import { prisma } from "../prismaClient";

const elo = new EloRank(50);

export const getPlayers = async () => {
    const players = await prisma.player.findMany({
        include: {
            matchesAsWinner: true,
            matchesAsLoser: true,
            eloLogs: true
        }
    });
    (players);
    return players;
};

export const createPlayer = async (name: string) => {
    return await prisma.player.create({
        data: {
            name,
            currentELO: 1500, // Starting individual ELO rating
            currentTeamELO: 1500 // Starting team ELO rating
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


export const logIndividualELO = async (playerId: number, elo: number, matchId: number) => {
    await prisma.eLOLog.create({
        data: {
            playerId,
            elo,
            matchId
        }
    });
};

const logTeamPlayerELO = async (teamId: number, elo: number, matchId: number) => {
    await prisma.teamPlayerELOLog.create({
        data: {
            teamId,
            elo,
            matchId
        }
    });
};

const logTeamELO = async (teamId: number, elo: number, matchId: number) => {
    await prisma.teamELOLog.create({
        data: {
            teamId,
            elo,
            matchId
        }
    }); 
}

export const calculateNewELOs = (currentELOPlayer1: number, currentELOPlayer2: number, player1IsWinner: boolean) => {
    const player1Score = player1IsWinner ? 1 : 0;
    const player2Score = player1IsWinner ? 0 : 1;
    
    const expectedScorePlayer1 = elo.getExpected(currentELOPlayer1, currentELOPlayer2);
    const expectedScorePlayer2 = elo.getExpected(currentELOPlayer2, currentELOPlayer1);
    
    const newELOPlayer1 = elo.updateRating(expectedScorePlayer1, player1Score, currentELOPlayer1);
    const newELOPlayer2 = elo.updateRating(expectedScorePlayer2, player2Score, currentELOPlayer2);
    
    return {
        newELOPlayer1,
        newELOPlayer2
    };
};
export const recordMatch = async (winnerId: number, loserId: number, winnerELO: number, loserELO: number) => {
    return await prisma.match.create({
        data: {
            winnerId,
            loserId,
            winnerELO,
            loserELO
        }
    });
};

export const createTeam = async (player1Id: number, player2Id: number) => {
    // First, try to find a team that includes both players
    const existingTeam = await prisma.team.findFirst({
        where: {
            players: {
                every: {
                    OR: [
                        { id: player1Id },
                        { id: player2Id }
                    ]
                }
            }
        },
        include: {
            players: true // Include players in the response
        }
    });

    // If such a team exists, return it
    if (existingTeam) {
        return existingTeam;
    }

    // If not, create a new team with these players
    return await prisma.team.create({
        data: {
            players: {
                connect: [{ id: player1Id }, { id: player2Id }]
            }
        },
        include: {
            players: true // Include players in the response
        }
    });
};

const updateTeamELO = async (teamId: number, newElo: number) => {
    const team  = await prisma.team.findUnique({
        where: { id: teamId },
    })

    await prisma.team.update({
        where: { id: teamId },
        data: { 
            previousELO: team.currentELO,
            currentELO: newElo 
        },
    });
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
}: UpdateELOsTeamPlayInput){

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

// Calculate new ELOs for team matches
export const calculateNewTeamELOs = (currentELOTeam1: number, currentELOTeam2: number, team1IsWinner: boolean) => {
    const team1Score = team1IsWinner ? 1 : 0;
    const team2Score = team1IsWinner ? 0 : 1;

    const expectedScoreTeam1 = elo.getExpected(currentELOTeam1, currentELOTeam2);
    const expectedScoreTeam2 = elo.getExpected(currentELOTeam2, currentELOTeam1);

    const newELOTeam1 = elo.updateRating(expectedScoreTeam1, team1Score, currentELOTeam1);
    const newELOTeam2 = elo.updateRating(expectedScoreTeam2, team2Score, currentELOTeam2);

    return {
        newELOTeam1,
        newELOTeam2
    };
};

export const calculateNewIndividualELOs = (
    eloPlayer1Team1: number, eloPlayer2Team1: number, eloPlayer1Team2: number, eloPlayer2Team2: number, team1IsWinner: boolean
) => {
    const averageEloTeam1 = (eloPlayer1Team1 + eloPlayer2Team1) / 2;
    const averageEloTeam2 = (eloPlayer1Team2 + eloPlayer2Team2) / 2;

    console.log(`Average ELOs: Team 1: ${averageEloTeam1}, Team 2: ${averageEloTeam2}`);

    const player1Team1Score = team1IsWinner ? 1 : 0;
    const player2Team1Score = team1IsWinner ? 1 : 0;
    const player1Team2Score = team1IsWinner ? 0 : 1;
    const player2Team2Score = team1IsWinner ? 0 : 1;

    console.log(`Scores: Team 1 - Player 1: ${player1Team1Score}, Player 2: ${player2Team1Score}; Team 2 - Player 1: ${player1Team2Score}, Player 2: ${player2Team2Score}`);

    const newELOPlayer1Team1 = elo.updateRating(elo.getExpected(averageEloTeam1, averageEloTeam2), player1Team1Score, eloPlayer1Team1);
    const newELOPlayer2Team1 = elo.updateRating(elo.getExpected(averageEloTeam1, averageEloTeam2), player2Team1Score, eloPlayer2Team1);
    const newELOPlayer1Team2 = elo.updateRating(elo.getExpected(averageEloTeam2, averageEloTeam1), player1Team2Score, eloPlayer1Team2);
    const newELOPlayer2Team2 = elo.updateRating(elo.getExpected(averageEloTeam2, averageEloTeam1), player2Team2Score, eloPlayer2Team2);

    console.log(`New ELOs: Team 1 - Player 1: ${newELOPlayer1Team1}, Player 2: ${newELOPlayer2Team1}; Team 2 - Player 1: ${newELOPlayer1Team2}, Player 2: ${newELOPlayer2Team2}`);

    return {
        newELOPlayer1Team1,
        newELOPlayer2Team1,
        newELOPlayer1Team2,
        newELOPlayer2Team2
    };
};

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

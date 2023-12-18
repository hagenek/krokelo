// services/playerService.ts
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
            currentELO: 1500 // Starting ELO rating
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

export const updateELO = async (playerId: number, elo: number) => {
    return await prisma.player.update({
        where: {
            id: playerId,
        },
        data: {
            currentELO: elo,
        },
    });
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

export const logELO = async (playerId: number, elo: number) => {
    return await prisma.eLOLog.create({
        data: {
            playerId,
            elo
        }
    });
};

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



// Create a new team with two players
export const createTeam = async (player1Id: number, player2Id: number) => {
    return await prisma.team.create({
        data: {
            players: {
                connect: [{ id: player1Id }, { id: player2Id }]
            }
        }
    });
};

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

// Update ELO for each player in a team
export const updateTeamELO = async (teamId: number, newELO: number) => {
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { players: true }
    });

    if (team && team.players) {
        for (const player of team.players) {
            await updateELO(player.id, newELO);
        }
    }
};
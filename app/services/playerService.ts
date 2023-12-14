// services/playerService.ts
import EloRank from 'elo-rank';
import { prisma } from "../prismaClient";

const elo = new EloRank(30);

export const getPlayers = async () => {
    const players = await prisma.player.findMany({
        include: {
            matchesAsWinner: true,
            matchesAsLoser: true,
            eloLogs: true
        }
    });
    console.log(players);
    return players;
};

export const createPlayer = async (name: string) => {
    return await prisma.player.create({
        data: {
            name,
            currentELO: 1000 // Starting ELO rating
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
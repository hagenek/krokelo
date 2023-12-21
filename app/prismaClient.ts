import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

// Check if we're in a production environment or not
if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    // Check if there's already a global instance of PrismaClient
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export { prisma };
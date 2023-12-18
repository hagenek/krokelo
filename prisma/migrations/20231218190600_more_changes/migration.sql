/*
  Warnings:

  - You are about to drop the column `teamId` on the `ELOLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ELOLog" DROP CONSTRAINT "ELOLog_teamId_fkey";

-- AlterTable
ALTER TABLE "ELOLog" DROP COLUMN "teamId";

-- CreateTable
CREATE TABLE "TeamPlayerELOLog" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "elo" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamPlayerELOLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamELOLog" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "elo" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamELOLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeamPlayerELOLog_playerId_idx" ON "TeamPlayerELOLog"("playerId");

-- CreateIndex
CREATE INDEX "TeamELOLog_teamId_idx" ON "TeamELOLog"("teamId");

-- AddForeignKey
ALTER TABLE "TeamPlayerELOLog" ADD CONSTRAINT "TeamPlayerELOLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamELOLog" ADD CONSTRAINT "TeamELOLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

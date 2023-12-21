/*
  Warnings:

  - You are about to drop the column `teamId` on the `Player` table. All the data in the column will be lost.
  - Added the required column `matchId` to the `ELOLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchId` to the `TeamELOLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchId` to the `TeamPlayerELOLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_teamId_fkey";

-- AlterTable
ALTER TABLE "ELOLog" ADD COLUMN     "matchId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "teamId",
ADD COLUMN     "previousELO" INTEGER,
ADD COLUMN     "previousTeamELO" INTEGER;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "previousELO" INTEGER;

-- AlterTable
ALTER TABLE "TeamELOLog" ADD COLUMN     "matchId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TeamPlayerELOLog" ADD COLUMN     "matchId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ELOLog" ADD CONSTRAINT "ELOLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPlayerELOLog" ADD CONSTRAINT "TeamPlayerELOLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamELOLog" ADD CONSTRAINT "TeamELOLog_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

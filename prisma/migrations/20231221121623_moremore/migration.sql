/*
  Warnings:

  - You are about to drop the column `matchId` on the `TeamELOLog` table. All the data in the column will be lost.
  - You are about to drop the column `matchId` on the `TeamPlayerELOLog` table. All the data in the column will be lost.
  - Added the required column `teamMatchId` to the `TeamELOLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamMatchId` to the `TeamPlayerELOLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TeamELOLog" DROP CONSTRAINT "TeamELOLog_matchId_fkey";

-- DropForeignKey
ALTER TABLE "TeamPlayerELOLog" DROP CONSTRAINT "TeamPlayerELOLog_matchId_fkey";

-- AlterTable
ALTER TABLE "TeamELOLog" DROP COLUMN "matchId",
ADD COLUMN     "teamMatchId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TeamPlayerELOLog" DROP COLUMN "matchId",
ADD COLUMN     "teamMatchId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TeamPlayerELOLog" ADD CONSTRAINT "TeamPlayerELOLog_teamMatchId_fkey" FOREIGN KEY ("teamMatchId") REFERENCES "TeamMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamELOLog" ADD CONSTRAINT "TeamELOLog_teamMatchId_fkey" FOREIGN KEY ("teamMatchId") REFERENCES "TeamMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

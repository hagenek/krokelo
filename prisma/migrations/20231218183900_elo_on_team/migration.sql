/*
  Warnings:

  - Added the required column `teamId` to the `ELOLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ELOLog" ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "currentELO" INTEGER NOT NULL DEFAULT 1500;

-- AddForeignKey
ALTER TABLE "ELOLog" ADD CONSTRAINT "ELOLog_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

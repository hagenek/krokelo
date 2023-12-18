-- CreateTable
CREATE TABLE "TeamMembers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "TeamMembers_pkey" PRIMARY KEY ("A")
);

-- CreateIndex
CREATE INDEX "TeamMembers_B_idx" ON "TeamMembers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMembers_A_B_key" ON "TeamMembers"("A", "B");

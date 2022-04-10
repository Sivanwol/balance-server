/*
  Warnings:

  - The `action` column on the `activity_log` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('Draft', 'Open', 'InProcess', 'Close');

-- CreateEnum
CREATE TYPE "MatchMode" AS ENUM ('Free', 'Points', 'TimedTurn', 'UpToPoints');

-- AlterTable
ALTER TABLE "activity_log" DROP COLUMN "action",
ADD COLUMN     "action" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "disabledForeverAt" TIMESTAMP(3);

-- DropEnum
DROP TYPE "ActionTypes";

-- CreateTable
CREATE TABLE "MatchsMoves" (
    "id" TEXT NOT NULL,
    "matchId" UUID NOT NULL,
    "boardMoveIdx" INTEGER NOT NULL,

    CONSTRAINT "MatchsMoves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matchs" (
    "id" TEXT NOT NULL,
    "matchMode" "MatchMode" NOT NULL DEFAULT E'Free',
    "stakeForMatch" INTEGER NOT NULL DEFAULT 0,
    "privateMatch" BOOLEAN NOT NULL DEFAULT false,
    "player1" UUID NOT NULL,
    "player1Wins" INTEGER NOT NULL,
    "player2" UUID NOT NULL,
    "player2Wins" INTEGER NOT NULL,
    "totalMatchs" INTEGER NOT NULL DEFAULT 1,
    "status" "MatchStatus" NOT NULL DEFAULT E'Draft',

    CONSTRAINT "matchs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "matchs_player1_player2_idx" ON "matchs"("player1", "player2");

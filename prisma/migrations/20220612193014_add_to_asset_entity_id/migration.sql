/*
  Warnings:

  - Added the required column `entityId` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assets" ADD COLUMN     "entityId" UUID NOT NULL;

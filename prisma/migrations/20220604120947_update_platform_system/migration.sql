/*
  Warnings:

  - The `service` column on the `platform_settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PlatformServices" AS ENUM ('ALL', 'API', 'CONFIG');

-- AlterTable
ALTER TABLE "platform_settings" ADD COLUMN     "isClientSecure" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isClientSide" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "service",
ADD COLUMN     "service" "PlatformServices" NOT NULL DEFAULT E'ALL';

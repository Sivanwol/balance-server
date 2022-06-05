/*
  Warnings:

  - The values [ALL,CONFIG] on the enum `PlatformServices` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlatformServices_new" AS ENUM ('API');
ALTER TABLE "platform_settings" ALTER COLUMN "service" DROP DEFAULT;
ALTER TABLE "platform_settings" ALTER COLUMN "service" TYPE "PlatformServices_new" USING ("service"::text::"PlatformServices_new");
ALTER TYPE "PlatformServices" RENAME TO "PlatformServices_old";
ALTER TYPE "PlatformServices_new" RENAME TO "PlatformServices";
DROP TYPE "PlatformServices_old";
ALTER TABLE "platform_settings" ALTER COLUMN "service" SET DEFAULT 'API';
COMMIT;

-- AlterTable
ALTER TABLE "platform_settings" ALTER COLUMN "service" SET DEFAULT E'API';

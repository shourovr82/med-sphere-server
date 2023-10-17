/*
  Warnings:

  - The values [rejected] on the enum `serviceStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `endTime` on the `time_slots` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `time_slots` table. All the data in the column will be lost.
  - Added the required column `slotTime` to the `time_slots` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "serviceStatus_new" AS ENUM ('available', 'upcoming');
ALTER TABLE "services" ALTER COLUMN "serviceStatus" DROP DEFAULT;
ALTER TABLE "services" ALTER COLUMN "serviceStatus" TYPE "serviceStatus_new" USING ("serviceStatus"::text::"serviceStatus_new");
ALTER TYPE "serviceStatus" RENAME TO "serviceStatus_old";
ALTER TYPE "serviceStatus_new" RENAME TO "serviceStatus";
DROP TYPE "serviceStatus_old";
ALTER TABLE "services" ALTER COLUMN "serviceStatus" SET DEFAULT 'available';
COMMIT;

-- DropIndex
DROP INDEX "time_slots_endTime_key";

-- DropIndex
DROP INDEX "time_slots_startTime_key";

-- AlterTable
ALTER TABLE "time_slots" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "slotTime" TEXT NOT NULL;

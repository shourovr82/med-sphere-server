/*
  Warnings:

  - You are about to drop the column `doctorId` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_doctorId_fkey";

-- DropIndex
DROP INDEX "profiles_doctorId_key";

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "doctorId";

-- CreateIndex
CREATE UNIQUE INDEX "doctors_profileId_key" ON "doctors"("profileId");

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

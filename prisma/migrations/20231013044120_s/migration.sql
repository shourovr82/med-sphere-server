/*
  Warnings:

  - You are about to drop the column `profilId` on the `faqs` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `faqs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "faqs" DROP CONSTRAINT "faqs_profilId_fkey";

-- AlterTable
ALTER TABLE "faqs" DROP COLUMN "profilId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

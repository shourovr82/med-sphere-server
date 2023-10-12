/*
  Warnings:

  - You are about to drop the column `profilId` on the `blogs` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_profilId_fkey";

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "profilId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

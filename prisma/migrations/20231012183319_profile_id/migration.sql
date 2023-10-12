/*
  Warnings:

  - You are about to drop the column `profilId` on the `products` table. All the data in the column will be lost.
  - Added the required column `profileId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_profilId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "profilId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

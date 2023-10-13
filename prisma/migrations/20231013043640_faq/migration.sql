/*
  Warnings:

  - The primary key for the `faqs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blogDescription` on the `faqs` table. All the data in the column will be lost.
  - You are about to drop the column `blogId` on the `faqs` table. All the data in the column will be lost.
  - You are about to drop the column `blogImage` on the `faqs` table. All the data in the column will be lost.
  - You are about to drop the column `blogTitle` on the `faqs` table. All the data in the column will be lost.
  - Added the required column `faqDescription` to the `faqs` table without a default value. This is not possible if the table is not empty.
  - The required column `faqId` was added to the `faqs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `faqTitle` to the `faqs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faqs" DROP CONSTRAINT "faqs_pkey",
DROP COLUMN "blogDescription",
DROP COLUMN "blogId",
DROP COLUMN "blogImage",
DROP COLUMN "blogTitle",
ADD COLUMN     "faqDescription" TEXT NOT NULL,
ADD COLUMN     "faqId" TEXT NOT NULL,
ADD COLUMN     "faqTitle" TEXT NOT NULL,
ADD CONSTRAINT "faqs_pkey" PRIMARY KEY ("faqId");

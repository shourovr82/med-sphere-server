/*
  Warnings:

  - You are about to drop the column `productId` on the `feedback_forms` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "feedback_forms" DROP CONSTRAINT "feedback_forms_productId_fkey";

-- AlterTable
ALTER TABLE "feedback_forms" DROP COLUMN "productId";

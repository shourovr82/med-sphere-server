/*
  Warnings:

  - Added the required column `feedbackSubject` to the `feedback_forms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feedback_forms" ADD COLUMN     "feedbackSubject" TEXT NOT NULL;

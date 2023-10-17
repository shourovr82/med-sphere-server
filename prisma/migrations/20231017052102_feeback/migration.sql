/*
  Warnings:

  - You are about to drop the `feedback_forms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "feedback_forms" DROP CONSTRAINT "feedback_forms_profileId_fkey";

-- DropForeignKey
ALTER TABLE "feedback_forms" DROP CONSTRAINT "feedback_forms_serviceId_fkey";

-- DropTable
DROP TABLE "feedback_forms";

-- CreateTable
CREATE TABLE "feedbacks" (
    "feedbackId" TEXT NOT NULL,
    "feedbackSubject" TEXT NOT NULL,
    "feedbackDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("feedbackId")
);

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

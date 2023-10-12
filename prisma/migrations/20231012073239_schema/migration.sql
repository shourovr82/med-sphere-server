/*
  Warnings:

  - You are about to drop the column `adminProfileId` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `categoryImage` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `adminProfileId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `userProfileId` on the `reviews_and_ratings` table. All the data in the column will be lost.
  - You are about to drop the column `adminProfileId` on the `services` table. All the data in the column will be lost.
  - The primary key for the `specializations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `specializations` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `specializations` table. All the data in the column will be lost.
  - You are about to drop the column `adminProfileId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `doctorProfileId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `superAdminProfileId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userProfileId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `admin_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `available_doctors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doctor_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `super_admin_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[specializationName]` on the table `specializations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profilId` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `profilId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `productPrice` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `profileId` to the `reviews_and_ratings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `reviews_and_ratings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicePrice` to the `services` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `services` required. This step will fail if there are existing NULL values in that column.
  - The required column `specializationId` was added to the `specializations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `specializationName` to the `specializations` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `specializations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "appointmentStatus" ADD VALUE 'cancelled';

-- AlterEnum
ALTER TYPE "serviceStatus" ADD VALUE 'rejected';

-- AlterEnum
ALTER TYPE "userRole" ADD VALUE 'DOCTOR';

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_slotId_fkey";

-- DropForeignKey
ALTER TABLE "available_doctors" DROP CONSTRAINT "available_doctors_doctorProfileDoctorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_adminProfileId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_profiles" DROP CONSTRAINT "doctor_profiles_specializationId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_adminProfileId_fkey";

-- DropForeignKey
ALTER TABLE "reviews_and_ratings" DROP CONSTRAINT "reviews_and_ratings_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_adminProfileId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_adminProfileId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_doctorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_superAdminProfileId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_userProfileId_fkey";

-- DropIndex
DROP INDEX "specializations_name_key";

-- DropIndex
DROP INDEX "users_adminProfileId_key";

-- DropIndex
DROP INDEX "users_doctorProfileId_key";

-- DropIndex
DROP INDEX "users_superAdminProfileId_key";

-- DropIndex
DROP INDEX "users_userProfileId_key";

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "adminProfileId",
ADD COLUMN     "profilId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "categoryImage",
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "adminProfileId",
ADD COLUMN     "profilId" TEXT NOT NULL,
DROP COLUMN "productPrice",
ADD COLUMN     "productPrice" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reviews_and_ratings" DROP COLUMN "userProfileId",
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "adminProfileId",
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "servicePrice" INTEGER NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "specializations" DROP CONSTRAINT "specializations_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "specializationId" TEXT NOT NULL,
ADD COLUMN     "specializationName" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ADD CONSTRAINT "specializations_pkey" PRIMARY KEY ("specializationId");

-- AlterTable
ALTER TABLE "time_slots" ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "adminProfileId",
DROP COLUMN "doctorProfileId",
DROP COLUMN "role",
DROP COLUMN "superAdminProfileId",
DROP COLUMN "userProfileId",
ADD COLUMN     "profileId" TEXT;

-- DropTable
DROP TABLE "admin_profiles";

-- DropTable
DROP TABLE "appointments";

-- DropTable
DROP TABLE "available_doctors";

-- DropTable
DROP TABLE "doctor_profiles";

-- DropTable
DROP TABLE "super_admin_profiles";

-- DropTable
DROP TABLE "user_profiles";

-- CreateTable
CREATE TABLE "profiles" (
    "profileId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "role" "userRole" NOT NULL,
    "contactNumber" TEXT,
    "address" TEXT,
    "coverPhoto" TEXT,
    "bloodGroup" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "doctorId" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("profileId")
);

-- CreateTable
CREATE TABLE "doctors" (
    "doctorId" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "specialization_id" TEXT NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("doctorId")
);

-- CreateTable
CREATE TABLE "faqs" (
    "blogId" TEXT NOT NULL,
    "blogTitle" TEXT NOT NULL,
    "blogDescription" TEXT NOT NULL,
    "blogImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profilId" TEXT NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("blogId")
);

-- CreateTable
CREATE TABLE "appointment_bookings" (
    "appointmentId" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "appointmentStatus" "appointmentStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serviceId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,

    CONSTRAINT "appointment_bookings_pkey" PRIMARY KEY ("appointmentId")
);

-- CreateTable
CREATE TABLE "feedback_forms" (
    "feedbackId" TEXT NOT NULL,
    "feedbackComment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serviceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "feedback_forms_pkey" PRIMARY KEY ("feedbackId")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_doctorId_key" ON "profiles"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "specializations_specializationName_key" ON "specializations"("specializationName");

-- CreateIndex
CREATE UNIQUE INDEX "users_profileId_key" ON "users"("profileId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("doctorId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "specializations"("specializationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews_and_ratings" ADD CONSTRAINT "reviews_and_ratings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews_and_ratings" ADD CONSTRAINT "reviews_and_ratings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("serviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_profilId_fkey" FOREIGN KEY ("profilId") REFERENCES "profiles"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_profilId_fkey" FOREIGN KEY ("profilId") REFERENCES "profiles"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_profilId_fkey" FOREIGN KEY ("profilId") REFERENCES "profiles"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_bookings" ADD CONSTRAINT "appointment_bookings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("serviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_bookings" ADD CONSTRAINT "appointment_bookings_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_bookings" ADD CONSTRAINT "appointment_bookings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "time_slots"("slotId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_forms" ADD CONSTRAINT "feedback_forms_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("serviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_forms" ADD CONSTRAINT "feedback_forms_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_forms" ADD CONSTRAINT "feedback_forms_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

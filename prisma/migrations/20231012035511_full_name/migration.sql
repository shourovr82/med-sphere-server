/*
  Warnings:

  - You are about to drop the column `fullName` on the `admin_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `doctor_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `super_admin_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user_profiles` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `admin_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `admin_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `doctor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `doctor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `super_admin_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `super_admin_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `user_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `user_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin_profiles" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "doctor_profiles" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "super_admin_profiles" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

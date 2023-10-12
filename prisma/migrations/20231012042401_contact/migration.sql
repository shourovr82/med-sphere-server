/*
  Warnings:

  - You are about to drop the column `email` on the `admin_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `admin_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `super_admin_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `super_admin_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `contactNo` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `profileImg` on the `user_profiles` table. All the data in the column will be lost.
  - Added the required column `profileImage` to the `admin_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileImage` to the `super_admin_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileImage` to the `user_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "admin_profiles_email_key";

-- DropIndex
DROP INDEX "super_admin_profiles_email_key";

-- AlterTable
ALTER TABLE "admin_profiles" DROP COLUMN "email",
DROP COLUMN "phoneNumber",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "profileImage" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "super_admin_profiles" DROP COLUMN "email",
DROP COLUMN "phoneNumber",
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "profileImage" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "contactNo",
DROP COLUMN "profileImg",
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "profileImage" TEXT NOT NULL;

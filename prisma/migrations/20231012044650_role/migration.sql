/*
  Warnings:

  - You are about to drop the column `role` on the `admin_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `super_admin_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user_profiles` table. All the data in the column will be lost.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin_profiles" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "super_admin_profiles" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "userRole" NOT NULL;

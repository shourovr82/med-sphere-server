/*
  Warnings:

  - The values [superadmin] on the enum `userRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "userRole_new" AS ENUM ('user', 'admin', 'super_admin');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "userRole_new" USING ("role"::text::"userRole_new");
ALTER TYPE "userRole" RENAME TO "userRole_old";
ALTER TYPE "userRole_new" RENAME TO "userRole";
DROP TYPE "userRole_old";
COMMIT;

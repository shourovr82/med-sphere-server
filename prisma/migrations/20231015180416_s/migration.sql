-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "profileImage" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER';

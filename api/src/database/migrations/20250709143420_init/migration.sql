-- AlterTable
ALTER TABLE "consultants" ADD COLUMN     "is_test_user" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_test_user" BOOLEAN DEFAULT false;

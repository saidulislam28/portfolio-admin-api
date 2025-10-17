-- AlterTable
ALTER TABLE "education" ALTER COLUMN "passed_year" DROP NOT NULL,
ALTER COLUMN "passed_year" DROP DEFAULT,
ALTER COLUMN "passed_year" SET DATA TYPE TEXT;

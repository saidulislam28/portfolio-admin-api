/*
  Warnings:

  - You are about to drop the column `instructor` on the `feedbacks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "feedbacks" DROP COLUMN "instructor",
ADD COLUMN     "consultant_id" INTEGER;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

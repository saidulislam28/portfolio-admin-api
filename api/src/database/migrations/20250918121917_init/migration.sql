/*
  Warnings:

  - A unique constraint covering the columns `[appointment_id]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ratings" ADD COLUMN     "appointment_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ratings_appointment_id_key" ON "ratings"("appointment_id");

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

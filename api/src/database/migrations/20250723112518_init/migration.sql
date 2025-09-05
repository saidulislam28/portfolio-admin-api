/*
  Warnings:

  - A unique constraint covering the columns `[appointment_id]` on the table `conversation_feedbacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[appointment_id]` on the table `speaking_test_feedbacks` will be added. If there are existing duplicate values, this will fail.
  - Made the column `appointment_id` on table `speaking_test_feedbacks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "speaking_test_feedbacks" ALTER COLUMN "appointment_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "conversation_feedbacks_appointment_id_key" ON "conversation_feedbacks"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "speaking_test_feedbacks_appointment_id_key" ON "speaking_test_feedbacks"("appointment_id");

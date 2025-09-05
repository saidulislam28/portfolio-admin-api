/*
  Warnings:

  - You are about to drop the column `date` on the `conversation_feedbacks` table. All the data in the column will be lost.
  - Made the column `appointment_id` on table `conversation_feedbacks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "conversation_feedbacks" DROP COLUMN "date",
ALTER COLUMN "appointment_id" SET NOT NULL;

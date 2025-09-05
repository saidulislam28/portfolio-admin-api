/*
  Warnings:

  - You are about to drop the column `date` on the `consultant_off_days` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[consultant_id,off_date]` on the table `consultant_off_days` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `off_date` to the `consultant_off_days` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "day_of_week" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- DropIndex
DROP INDEX "consultant_off_days_consultant_id_date_key";

-- AlterTable
ALTER TABLE "consultant_off_days" DROP COLUMN "date",
ADD COLUMN     "off_date" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "consultant_off_days_consultant_id_off_date_idx" ON "consultant_off_days"("consultant_id", "off_date");

-- CreateIndex
CREATE UNIQUE INDEX "consultant_off_days_consultant_id_off_date_key" ON "consultant_off_days"("consultant_id", "off_date");

-- CreateIndex
CREATE INDEX "consultant_work_hours_consultant_id_day_of_week_idx" ON "consultant_work_hours"("consultant_id", "day_of_week");

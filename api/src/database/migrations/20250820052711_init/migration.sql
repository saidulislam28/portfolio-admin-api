/*
  Warnings:

  - The `status` column on the `appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('INITIATED', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "status",
ADD COLUMN     "status" "AppointmentStatus" DEFAULT 'CONFIRMED';

-- DropEnum
DROP TYPE "Booking_Status";

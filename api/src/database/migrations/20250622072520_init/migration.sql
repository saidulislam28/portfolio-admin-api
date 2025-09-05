/*
  Warnings:

  - You are about to drop the `device_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "device_tokens" DROP CONSTRAINT "device_tokens_consultant_id_fkey";

-- DropForeignKey
ALTER TABLE "device_tokens" DROP CONSTRAINT "device_tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "consultants" ADD COLUMN     "device_type" TEXT,
ADD COLUMN     "token" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "device_type" TEXT,
ADD COLUMN     "token" TEXT;

-- DropTable
DROP TABLE "device_tokens";

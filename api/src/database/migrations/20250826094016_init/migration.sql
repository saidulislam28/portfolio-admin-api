/*
  Warnings:

  - You are about to drop the column `sslc_transaction_id` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "sslc_transaction_id";

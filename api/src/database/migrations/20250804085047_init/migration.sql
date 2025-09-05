/*
  Warnings:

  - You are about to drop the column `url` on the `video_slider` table. All the data in the column will be lost.
  - Added the required column `video_url` to the `video_slider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "video_slider" DROP COLUMN "url",
ADD COLUMN     "video_url" TEXT NOT NULL;

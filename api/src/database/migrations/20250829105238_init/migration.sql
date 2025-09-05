-- DropForeignKey
ALTER TABLE "schedule_notifications" DROP CONSTRAINT "schedule_notifications_user_id_fkey";

-- AlterTable
ALTER TABLE "schedule_notifications" ADD COLUMN     "consultant_id" INTEGER,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "schedule_notifications" ADD CONSTRAINT "schedule_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_notifications" ADD CONSTRAINT "schedule_notifications_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

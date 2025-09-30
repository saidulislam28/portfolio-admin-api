-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "meta" JSONB,
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'GENERAL';

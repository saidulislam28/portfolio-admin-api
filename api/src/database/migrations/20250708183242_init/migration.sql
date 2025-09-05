-- AlterTable
ALTER TABLE "otp_verifications" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "last_resend_at" TIMESTAMP(3),
ADD COLUMN     "resend_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "otp_resend_logs" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_resend_logs_pkey" PRIMARY KEY ("id")
);

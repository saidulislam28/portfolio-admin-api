-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'AGENT');

-- CreateEnum
CREATE TYPE "USER_ROLE" AS ENUM ('USER', 'CONSULTANT');

-- CreateEnum
CREATE TYPE "LOGIN_TYPE" AS ENUM ('EMAIL', 'GOOGLE', 'FACEBOOK', 'PHONE_NUMBER');

-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('PENDING', 'FAILED', 'CANCELED', 'PAID');

-- CreateEnum
CREATE TYPE "Booking_Status" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPOINTMENT_REMINDER', 'PAYMENT_REMINDER', 'GENERAL');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'PUSH', 'SMS');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'RETRY');

-- CreateEnum
CREATE TYPE "HistoryType" AS ENUM ('info', 'success', 'error');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('book_purchase', 'ielts_gt', 'ielts_academic', 'spoken', 'speaking_mock_test', 'conversation', 'exam_registration');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Canceled');

-- CreateEnum
CREATE TYPE "Progress_Status" AS ENUM ('Pending', 'Approved', 'Rejected', 'Canceled');

-- CreateEnum
CREATE TYPE "Order_Progress" AS ENUM ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');

-- CreateEnum
CREATE TYPE "Payment_Status" AS ENUM ('Paid', 'Pending', 'Failed', 'Refunded');

-- CreateEnum
CREATE TYPE "OrderPaymentStatus" AS ENUM ('unpaid', 'partial', 'paid');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "phone" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "role" "AdminRole",
    "push_token" TEXT,
    "profile_photo" VARCHAR(200),
    "timezone" VARCHAR(20),

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_password_resets" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(200),
    "reset_code" VARCHAR(200),
    "reset_token" VARCHAR(200),

    CONSTRAINT "admin_password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" SERIAL NOT NULL,
    "url" TEXT,
    "datetime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,
    "care_home_id" INTEGER,
    "city_id" INTEGER,
    "short_order" INTEGER DEFAULT 1,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" VARCHAR(200),
    "phone" VARCHAR(200),
    "password" TEXT,

    CONSTRAINT "test_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_password" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "token" TEXT,
    "otp" VARCHAR(10),
    "role" TEXT,
    "is_verified" BOOLEAN DEFAULT false,

    CONSTRAINT "reset_password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" SERIAL NOT NULL,
    "otp" INTEGER,
    "email" VARCHAR(200),
    "phone" VARCHAR(200),

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "timezone" TEXT,
    "expected_level" TEXT,
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_verified" BOOLEAN DEFAULT false,
    "login_type" "LOGIN_TYPE" NOT NULL DEFAULT 'EMAIL',
    "profile_image" TEXT,
    "role" "USER_ROLE" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "message" TEXT,
    "isRead" BOOLEAN DEFAULT false,
    "user_id" INTEGER,
    "consultant_id" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_tokens" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER,
    "consultant_id" INTEGER,
    "token" TEXT NOT NULL,
    "deviceType" TEXT,

    CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultants" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "profile_image" TEXT,
    "password" TEXT,
    "timezone" TEXT DEFAULT 'UTC',
    "is_active" BOOLEAN DEFAULT false,
    "is_mocktest" BOOLEAN DEFAULT false,
    "is_conversation" BOOLEAN DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT,
    "experience" INTEGER,
    "skills" TEXT,
    "hourly_rate" DOUBLE PRECISION,
    "available_times" JSONB,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "consultants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT,
    "value" TEXT,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "is_super_admin" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_calls" (
    "id" SERIAL NOT NULL,
    "agora_channel" TEXT,
    "appointment_id" INTEGER,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "video_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "consultant_id" INTEGER,
    "rating" INTEGER,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "order_id" INTEGER,
    "amount" INTEGER,
    "currency" TEXT,
    "status" "PAYMENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "payment_method" TEXT,
    "transaction_id" TEXT,
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_pages" (
    "id" SERIAL NOT NULL,
    "slug" TEXT,
    "title" TEXT,
    "content" TEXT,
    "is_published" BOOLEAN DEFAULT false,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "cms_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "price_bdt" INTEGER,
    "price_usd" INTEGER,
    "price_bdt_original" INTEGER,
    "price_usd_original" INTEGER,
    "class_count" INTEGER,
    "sessions_count" INTEGER,
    "class_duration" INTEGER,
    "sort_order" INTEGER DEFAULT 1,
    "service_type" "ServiceType",
    "description" TEXT,
    "image" TEXT,
    "is_active" BOOLEAN DEFAULT false,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "status" "OrderStatus",
    "payment_status" "OrderPaymentStatus" DEFAULT 'unpaid',
    "service_type" "ServiceType",
    "meta_data" JSONB,
    "user_id" INTEGER,
    "package_id" INTEGER,
    "delivery_address" TEXT,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "subtotal" DOUBLE PRECISION,
    "delivery_charge" DOUBLE PRECISION,
    "order_info" JSONB,
    "total" DOUBLE PRECISION,
    "cancel_reason" TEXT,
    "canceled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "isbn" TEXT,
    "price" INTEGER,
    "image" TEXT,
    "is_available" BOOLEAN DEFAULT false,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "book_id" INTEGER,
    "qty" INTEGER,
    "unit_price" INTEGER,
    "subtotal" INTEGER,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "status" "Booking_Status" DEFAULT 'CONFIRMED',
    "duration_in_min" INTEGER NOT NULL DEFAULT 20,
    "notes" TEXT,
    "booked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT,
    "consultant_id" INTEGER,
    "user_id" INTEGER,
    "cancel_reason" TEXT,
    "order_id" INTEGER NOT NULL,
    "slot_date" TIMESTAMP(3) NOT NULL,
    "slot_time" TEXT NOT NULL,
    "user_timezone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_settings" (
    "id" SERIAL NOT NULL,
    "slot_duration_minutes" INTEGER NOT NULL DEFAULT 20,
    "booking_advance_weeks" INTEGER NOT NULL DEFAULT 3,
    "working_hours_start" TEXT NOT NULL DEFAULT '09:00',
    "working_hours_end" TEXT NOT NULL DEFAULT '18:00',
    "working_days" JSONB NOT NULL DEFAULT '[1,2,3,4,5,6]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "day_schedules" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dateString" TEXT NOT NULL,

    CONSTRAINT "day_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slots" (
    "id" SERIAL NOT NULL,
    "time" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "isPast" BOOLEAN NOT NULL DEFAULT false,
    "day_schedule_id" INTEGER NOT NULL,

    CONSTRAINT "slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_vendors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "book_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "sendAt" TIMESTAMP(3) NOT NULL,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "schedule_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_logs" (
    "id" SERIAL NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "error_message" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "response_time" INTEGER,

    CONSTRAINT "notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_password_resets_email_key" ON "admin_password_resets"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_email_key" ON "reset_password"("email");

-- CreateIndex
CREATE UNIQUE INDEX "otp_verifications_email_key" ON "otp_verifications"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_user_id_key" ON "device_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_consultant_id_key" ON "device_tokens"("consultant_id");

-- CreateIndex
CREATE UNIQUE INDEX "consultants_email_key" ON "consultants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "consultants_phone_key" ON "consultants"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_phone_key" ON "admins"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "video_calls_agora_channel_key" ON "video_calls"("agora_channel");

-- CreateIndex
CREATE UNIQUE INDEX "video_calls_appointment_id_key" ON "video_calls"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "payments"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "cms_pages_slug_key" ON "cms_pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_token_key" ON "appointments"("token");

-- CreateIndex
CREATE INDEX "appointments_slot_date_slot_time_idx" ON "appointments"("slot_date", "slot_time");

-- CreateIndex
CREATE INDEX "appointments_start_at_idx" ON "appointments"("start_at");

-- CreateIndex
CREATE INDEX "schedule_notifications_status_sendAt_idx" ON "schedule_notifications"("status", "sendAt");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_tokens" ADD CONSTRAINT "device_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_tokens" ADD CONSTRAINT "device_tokens_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_calls" ADD CONSTRAINT "video_calls_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_day_schedule_id_fkey" FOREIGN KEY ("day_schedule_id") REFERENCES "day_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_notifications" ADD CONSTRAINT "schedule_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_logs" ADD CONSTRAINT "notification_logs_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "schedule_notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "consultant_work_hours" (
    "id" SERIAL NOT NULL,
    "consultant_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultant_work_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultant_off_days" (
    "id" SERIAL NOT NULL,
    "consultant_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultant_off_days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "consultant_work_hours_consultant_id_day_of_week_start_time__key" ON "consultant_work_hours"("consultant_id", "day_of_week", "start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "consultant_off_days_consultant_id_date_key" ON "consultant_off_days"("consultant_id", "date");

-- AddForeignKey
ALTER TABLE "consultant_work_hours" ADD CONSTRAINT "consultant_work_hours_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultant_off_days" ADD CONSTRAINT "consultant_off_days_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

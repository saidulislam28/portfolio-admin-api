-- CreateTable
CREATE TABLE "web-settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT,
    "value" TEXT,

    CONSTRAINT "web-settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "web-settings_key_key" ON "web-settings"("key");

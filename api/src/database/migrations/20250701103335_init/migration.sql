-- CreateTable
CREATE TABLE "app_sliders" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "app_sliders_pkey" PRIMARY KEY ("id")
);

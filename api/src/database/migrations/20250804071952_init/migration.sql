-- CreateTable
CREATE TABLE "video_slider" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "video_slider_pkey" PRIMARY KEY ("id")
);

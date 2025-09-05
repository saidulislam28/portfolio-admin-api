-- CreateTable
CREATE TABLE "exam_centers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "exam_centers_pkey" PRIMARY KEY ("id")
);

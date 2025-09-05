-- CreateTable
CREATE TABLE "feedback_comments" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "desc" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER DEFAULT 1,

    CONSTRAINT "feedback_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER,
    "sort_order" INTEGER,
    "question" TEXT,
    "answer" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" SERIAL NOT NULL,
    "user_name" VARCHAR(200) NOT NULL,
    "desc" TEXT,
    "rating" INTEGER,
    "designation" VARCHAR(200),
    "company" VARCHAR(200),
    "city" VARCHAR(200),
    "image" VARCHAR(200),
    "sort_order" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

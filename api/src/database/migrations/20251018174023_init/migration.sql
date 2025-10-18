-- CreateTable
CREATE TABLE "competencies" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "sort_order" INTEGER,
    "is_frontend" BOOLEAN NOT NULL DEFAULT false,
    "is_backend" BOOLEAN NOT NULL DEFAULT false,
    "is_database" BOOLEAN NOT NULL DEFAULT false,
    "is_other" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "competencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "company" TEXT,
    "session" TEXT,
    "desc" TEXT,
    "sort_order" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "experience_pkey" PRIMARY KEY ("id")
);

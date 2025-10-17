-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "level" TEXT,
    "image" TEXT,
    "sort_order" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "short_desc" TEXT,
    "desc" TEXT,
    "live_url" TEXT,
    "git_url" TEXT,
    "image" TEXT,
    "sort_order" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "institute" TEXT,
    "session" TEXT,
    "department" TEXT,
    "gpa" TEXT,
    "out_of_gpa" TEXT,
    "level" TEXT,
    "sort_order" INTEGER,
    "passed_year" BOOLEAN NOT NULL DEFAULT false,
    "is_passed" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

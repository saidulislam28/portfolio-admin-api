-- CreateTable
CREATE TABLE "study_abroad_reg" (
    "id" SERIAL NOT NULL,
    "is_active" BOOLEAN,
    "values" TEXT NOT NULL,

    CONSTRAINT "study_abroad_reg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "online_course_reg" (
    "id" SERIAL NOT NULL,
    "is_active" BOOLEAN,
    "values" TEXT NOT NULL,

    CONSTRAINT "online_course_reg_pkey" PRIMARY KEY ("id")
);

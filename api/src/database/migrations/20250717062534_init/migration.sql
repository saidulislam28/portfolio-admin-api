-- CreateTable
CREATE TABLE "ielts_test_registration" (
    "id" SERIAL NOT NULL,
    "is_active" BOOLEAN,
    "values" JSONB NOT NULL,

    CONSTRAINT "ielts_test_registration_pkey" PRIMARY KEY ("id")
);

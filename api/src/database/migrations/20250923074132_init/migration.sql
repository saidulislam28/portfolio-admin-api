-- CreateTable
CREATE TABLE "help-request" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "subject" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help-request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "originalFileUrl" TEXT NOT NULL,
    "originalFileFormat" TEXT NOT NULL,
    "originalFileSize" INTEGER NOT NULL,
    "userIp" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

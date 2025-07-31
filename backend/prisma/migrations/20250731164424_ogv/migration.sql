-- CreateTable
CREATE TABLE "UploadModel" (
    "id" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "expiresIn" INTEGER NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "originalFileUrl" TEXT NOT NULL,
    "originalFileFormat" TEXT NOT NULL,
    "originalFileSize" INTEGER NOT NULL,
    "convertedFileUrl" TEXT NOT NULL,
    "userIP" TEXT NOT NULL,

    CONSTRAINT "UploadModel_pkey" PRIMARY KEY ("id")
);

/*
  Warnings:

  - You are about to drop the column `userIp` on the `UploadModel` table. All the data in the column will be lost.
  - Added the required column `userIP` to the `UploadModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UploadModel" DROP COLUMN "userIp",
ADD COLUMN     "userIP" TEXT NOT NULL;

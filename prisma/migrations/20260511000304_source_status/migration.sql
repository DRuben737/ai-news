-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "lastFetched" TIMESTAMP(3);

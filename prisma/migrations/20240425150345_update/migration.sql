-- AlterTable
ALTER TABLE "Prescription" ALTER COLUMN "followUpDate" DROP NOT NULL,
ALTER COLUMN "followUpDate" SET DATA TYPE TEXT;

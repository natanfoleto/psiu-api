/*
  Warnings:

  - The required column `id` was added to the `settings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "settings_upload_prhase_key";

-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");

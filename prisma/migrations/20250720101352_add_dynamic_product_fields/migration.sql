/*
  Warnings:

  - Added the required column `category` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subcategory` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "details" JSONB NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "subcategory" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

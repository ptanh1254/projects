/*
  Warnings:

  - You are about to drop the column `instagramUrl` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "instagramUrl",
ADD COLUMN     "whatsappUrl" TEXT;

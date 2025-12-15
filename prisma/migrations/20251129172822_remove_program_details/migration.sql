/*
  Warnings:

  - You are about to drop the column `description` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `occupations` on the `Program` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Program" DROP COLUMN "description",
DROP COLUMN "occupations";

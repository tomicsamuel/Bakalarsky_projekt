-- AlterTable
ALTER TABLE "Account" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN "description" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "consentGivenAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

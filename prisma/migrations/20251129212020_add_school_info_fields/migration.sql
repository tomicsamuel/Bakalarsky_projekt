-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expectations" TEXT[],
ADD COLUMN     "howDidYouHear" TEXT[],
ADD COLUMN     "howDidYouHearOther" TEXT,
ADD COLUMN     "whyThisSchool" TEXT[];

/*
  Warnings:

  - You are about to drop the column `isAvtive` on the `Doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Doctors" DROP COLUMN "isAvtive",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

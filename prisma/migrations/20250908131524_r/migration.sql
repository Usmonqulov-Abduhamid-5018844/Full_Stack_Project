/*
  Warnings:

  - Made the column `verified` on table `Doctors` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Doctors" ALTER COLUMN "verified" SET NOT NULL;

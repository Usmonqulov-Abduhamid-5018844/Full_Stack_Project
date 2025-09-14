/*
  Warnings:

  - Made the column `role` on table `Patients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Patients" ALTER COLUMN "role" SET NOT NULL;

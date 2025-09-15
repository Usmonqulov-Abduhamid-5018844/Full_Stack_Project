/*
  Warnings:

  - You are about to drop the column `email` on the `Doctors` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Doctors` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Patients` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Patients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Doctors" DROP COLUMN "email",
DROP COLUMN "password";

-- AlterTable
ALTER TABLE "public"."Patients" DROP COLUMN "email",
DROP COLUMN "password";

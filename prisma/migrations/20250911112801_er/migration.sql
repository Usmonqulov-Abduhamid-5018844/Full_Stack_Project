/*
  Warnings:

  - You are about to drop the column `desc` on the `Service_type` table. All the data in the column will be lost.
  - You are about to drop the column `desc` on the `Specialization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Admins" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "public"."Doctors" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "public"."Patients" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "public"."Service_type" DROP COLUMN "desc";

-- AlterTable
ALTER TABLE "public"."Specialization" DROP COLUMN "desc";

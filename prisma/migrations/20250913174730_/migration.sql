/*
  Warnings:

  - A unique constraint covering the columns `[doctor_id]` on the table `Wellet` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Patients" ALTER COLUMN "role" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Wellet_doctor_id_key" ON "public"."Wellet"("doctor_id");

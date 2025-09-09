/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Patients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admins_phone_key" ON "public"."Admins"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_phone_key" ON "public"."Patients"("phone");

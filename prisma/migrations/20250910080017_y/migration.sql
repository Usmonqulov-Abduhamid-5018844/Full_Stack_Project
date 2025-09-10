/*
  Warnings:

  - You are about to drop the column `price` on the `Appointments` table. All the data in the column will be lost.
  - The `status` column on the `Appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Appointments" DROP COLUMN "price",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- DropEnum
DROP TYPE "public"."EAppointments";

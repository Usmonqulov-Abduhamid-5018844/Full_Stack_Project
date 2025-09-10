/*
  Warnings:

  - You are about to drop the column `quantity` on the `Appointments` table. All the data in the column will be lost.
  - Made the column `reyting` on table `Doctors` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Appointments" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "public"."Doctors" ADD COLUMN     "reyting_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "reyting" SET NOT NULL;

/*
  Warnings:

  - Changed the type of `day_of_week` on the `doctor_schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Service_type" ALTER COLUMN "desc" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Specialization" ALTER COLUMN "desc" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."doctor_schedules" DROP COLUMN "day_of_week",
ADD COLUMN     "day_of_week" TEXT NOT NULL;

ALTER TABLE "doctor_schedules" 
ALTER COLUMN "day_of_week" TYPE VARCHAR(20) 
USING day_of_week::varchar;


-- DropEnum
DROP TYPE "public"."EDoctor";



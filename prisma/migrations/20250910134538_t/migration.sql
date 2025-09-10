-- DropForeignKey
ALTER TABLE "public"."Patients_card" DROP CONSTRAINT "Patients_card_patients_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Patients_card" ADD CONSTRAINT "Patients_card_patients_id_fkey" FOREIGN KEY ("patients_id") REFERENCES "public"."Patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."Tibbiy_korik" ADD COLUMN     "patientsId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Doctor_services" ADD CONSTRAINT "Doctor_services_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctor_services" ADD CONSTRAINT "Doctor_services_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "public"."Service_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wellet" ADD CONSTRAINT "Wellet_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctor_specialization" ADD CONSTRAINT "Doctor_specialization_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctor_specialization" ADD CONSTRAINT "Doctor_specialization_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "public"."Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctor_card" ADD CONSTRAINT "Doctor_card_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctor_file" ADD CONSTRAINT "Doctor_file_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."doctor_schedules" ADD CONSTRAINT "doctor_schedules_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Patients_card" ADD CONSTRAINT "Patients_card_patients_id_fkey" FOREIGN KEY ("patients_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tibbiy_korik" ADD CONSTRAINT "Tibbiy_korik_patients_id_fkey" FOREIGN KEY ("patients_id") REFERENCES "public"."Patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tibbiy_korik" ADD CONSTRAINT "Tibbiy_korik_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointments" ADD CONSTRAINT "Appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointments" ADD CONSTRAINT "Appointments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointments" ADD CONSTRAINT "Appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Doctor_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_patients_id_fkey" FOREIGN KEY ("patients_id") REFERENCES "public"."Patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_patients_id_fkey" FOREIGN KEY ("patients_id") REFERENCES "public"."Patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

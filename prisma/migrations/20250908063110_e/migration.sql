-- CreateEnum
CREATE TYPE "public"."EAdminStatus" AS ENUM ('active', 'in_active', 'block');

-- CreateEnum
CREATE TYPE "public"."EAdminRoles" AS ENUM ('admin', 'supper_admin');

-- CreateEnum
CREATE TYPE "public"."EAppointments" AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."ECommentSender" AS ENUM ('doctor', 'patients');

-- CreateEnum
CREATE TYPE "public"."EDoctor" AS ENUM ('Dushanba', 'Seshanba', 'Chorshanba', 'payshanba', 'Juma', 'Shanba', 'Yakshanba');

-- CreateTable
CREATE TABLE "public"."Admins" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "public"."EAdminStatus" NOT NULL DEFAULT 'active',
    "image" TEXT,
    "role" "public"."EAdminRoles" NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctors" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "reyting" INTEGER NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "date_of_birth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "image" TEXT,
    "isAvtive" BOOLEAN NOT NULL DEFAULT false,
    "region" TEXT NOT NULL,

    CONSTRAINT "Doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctor_services" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "service_type_id" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Doctor_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service_type" (
    "id" SERIAL NOT NULL,
    "service_name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Service_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Wellet" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wellet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctor_specialization" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "specialization_id" INTEGER NOT NULL,

    CONSTRAINT "Doctor_specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Specialization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctor_card" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "card_name" TEXT NOT NULL,
    "card_number" INTEGER NOT NULL,
    "expire_month" TEXT NOT NULL,
    "expire_year" TEXT NOT NULL,

    CONSTRAINT "Doctor_card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctor_file" (
    "id" SERIAL NOT NULL,
    "passport_file" TEXT NOT NULL,
    "diplom_file" TEXT NOT NULL,
    "yatt_file" TEXT NOT NULL,
    "sertifikat_file" TEXT NOT NULL,
    "tibiy_varaqa_file" TEXT NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."doctor_schedules" (
    "id" SERIAL NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "day_of_week" "public"."EDoctor" NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "doctor_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Patients" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "image" TEXT,

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Patients_card" (
    "id" SERIAL NOT NULL,
    "patients_id" INTEGER NOT NULL,
    "card_name" TEXT NOT NULL,
    "card_number" INTEGER NOT NULL,
    "expire_month" TEXT NOT NULL,
    "expire_year" TEXT NOT NULL,

    CONSTRAINT "Patients_card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tibbiy_korik" (
    "id" SERIAL NOT NULL,
    "sana" TEXT NOT NULL,
    "ish_vaqti" TEXT NOT NULL,
    "vazni" INTEGER NOT NULL,
    "boyi" INTEGER NOT NULL,
    "qabuldagi_shikoyat" TEXT NOT NULL,
    "Anamnesis_morbi" TEXT NOT NULL,
    "Anamnesis_vitae" TEXT NOT NULL,
    "Epidemiologik_tarix" TEXT NOT NULL,
    "Status_praesens_objectivus" TEXT NOT NULL,
    "Tashxis" TEXT NOT NULL,
    "Tekshiruv" TEXT NOT NULL,
    "Tibbiy_tavsiyalar" TEXT NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "patients_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tibbiy_korik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Appointments" (
    "id" SERIAL NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "status" "public"."EAppointments" NOT NULL DEFAULT 'pending',
    "quantity" INTEGER NOT NULL,
    "appointment_date" TEXT NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "star" INTEGER NOT NULL,
    "sender" "public"."ECommentSender" NOT NULL,
    "patients_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payments" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "card_last4" INTEGER NOT NULL,
    "card_brand" TEXT NOT NULL,
    "card_token" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "patients_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

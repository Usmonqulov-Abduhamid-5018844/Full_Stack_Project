/*
  Warnings:

  - Added the required column `amount` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_id` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Payments" ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "transaction_id" TEXT NOT NULL,
ALTER COLUMN "card_last4" DROP NOT NULL,
ALTER COLUMN "card_brand" DROP NOT NULL,
ALTER COLUMN "card_token" DROP NOT NULL,
ALTER COLUMN "is_default" SET DEFAULT false,
ALTER COLUMN "doctor_id" DROP NOT NULL,
ALTER COLUMN "patients_id" DROP NOT NULL;

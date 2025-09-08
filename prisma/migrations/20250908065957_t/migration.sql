/*
  Warnings:

  - Added the required column `login` to the `Admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Admins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Admins" ADD COLUMN     "login" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

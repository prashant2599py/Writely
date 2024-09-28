/*
  Warnings:

  - A unique constraint covering the columns `[auth0ID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "auth0ID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_auth0ID_key" ON "User"("auth0ID");

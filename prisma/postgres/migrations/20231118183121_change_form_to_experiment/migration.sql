/*
  Warnings:

  - You are about to drop the column `type` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `forms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "forms" DROP CONSTRAINT "forms_teamId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "type";

-- DropTable
DROP TABLE "forms";

-- DropEnum
DROP TYPE "UserType";

-- CreateTable
CREATE TABLE "experiments" (
    "pk" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImage" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "teamId" INTEGER NOT NULL,
    "mongoId" TEXT NOT NULL,

    CONSTRAINT "experiments_pkey" PRIMARY KEY ("pk")
);

-- CreateIndex
CREATE UNIQUE INDEX "experiments_pk_mongoId_key" ON "experiments"("pk", "mongoId");

-- AddForeignKey
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("pk") ON DELETE RESTRICT ON UPDATE CASCADE;

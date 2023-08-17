-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SCIENTIST', 'REGULAR');

-- CreateTable
CREATE TABLE "users" (
    "pk" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "type" "UserType" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("pk")
);

-- CreateTable
CREATE TABLE "teams" (
    "pk" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("pk")
);

-- CreateTable
CREATE TABLE "forms" (
    "pk" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "teamId" INTEGER NOT NULL,
    "formMongoId" TEXT NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("pk")
);

-- CreateTable
CREATE TABLE "team_users" (
    "pk" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_users_pkey" PRIMARY KEY ("pk")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_pk_key" ON "users"("pk");

-- CreateIndex
CREATE UNIQUE INDEX "teams_pk_key" ON "teams"("pk");

-- CreateIndex
CREATE UNIQUE INDEX "forms_pk_formMongoId_key" ON "forms"("pk", "formMongoId");

-- CreateIndex
CREATE UNIQUE INDEX "team_users_userId_teamId_key" ON "team_users"("userId", "teamId");

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("pk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_users" ADD CONSTRAINT "team_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("pk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_users" ADD CONSTRAINT "team_users_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("pk") ON DELETE RESTRICT ON UPDATE CASCADE;

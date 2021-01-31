/*
  Warnings:

  - Added the required column `name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressOne` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressTwo` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locality` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pin` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderStatus` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "mobile" INTEGER NOT NULL,
ADD COLUMN     "addressOne" TEXT NOT NULL,
ADD COLUMN     "addressTwo" TEXT NOT NULL,
ADD COLUMN     "locality" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "pin" INTEGER NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "orderStatus" TEXT NOT NULL;

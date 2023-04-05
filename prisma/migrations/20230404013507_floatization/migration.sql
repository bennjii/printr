/*
  Warnings:

  - You are about to alter the column `price` on the `Bid` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Bid` MODIFY `price` DOUBLE NOT NULL;

/*
  Warnings:

  - Added the required column `constructor_id` to the `Printer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Printer` ADD COLUMN `constructor_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Printer` ADD CONSTRAINT `Printer_constructor_id_fkey` FOREIGN KEY (`constructor_id`) REFERENCES `Constructor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

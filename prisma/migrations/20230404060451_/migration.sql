/*
  Warnings:

  - Added the required column `printer_id` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bid` ADD COLUMN `printer_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_printer_id_fkey` FOREIGN KEY (`printer_id`) REFERENCES `Printer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `constructor_id` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `printer_id` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submitter_id` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Job` ADD COLUMN `constructor_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `printer_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `submitter_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_constructor_id_fkey` FOREIGN KEY (`constructor_id`) REFERENCES `Constructor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_printer_id_fkey` FOREIGN KEY (`printer_id`) REFERENCES `Printer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_submitter_id_fkey` FOREIGN KEY (`submitter_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

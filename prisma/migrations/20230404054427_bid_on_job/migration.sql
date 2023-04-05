/*
  Warnings:

  - Added the required column `job_id` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bid` ADD COLUMN `job_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

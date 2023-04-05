/*
  Warnings:

  - You are about to drop the column `bidder` on the `Bid` table. All the data in the column will be lost.
  - Added the required column `bidder_id` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bid` DROP COLUMN `bidder`,
    ADD COLUMN `bidder_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Bid` ADD CONSTRAINT `Bid_bidder_id_fkey` FOREIGN KEY (`bidder_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

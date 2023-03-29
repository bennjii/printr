-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `is_constructor` BOOLEAN NOT NULL,
    `location` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Constructor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `owner_id` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Constructor_owner_id_key`(`owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Printer` (
    `id` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `current_status` ENUM('IDLE', 'PRINTING', 'UNAVALIABLE') NOT NULL DEFAULT 'IDLE',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrinterMetadata` (
    `printer_id` VARCHAR(191) NOT NULL,
    `constructor_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PrinterMetadata_printer_id_key`(`printer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Job` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `current_status` ENUM('DRAFT', 'BIDDING', 'PREPRINT', 'PRINTING', 'PREDELIVERY', 'ENROUTE', 'COMPLETE', 'CANCELED') NOT NULL DEFAULT 'DRAFT',
    `status_history` JSON NOT NULL,
    `estimated_completion` VARCHAR(191) NOT NULL,
    `job_preferences` JSON NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `job_name` VARCHAR(191) NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobMetadata` (
    `job_id` VARCHAR(191) NOT NULL,
    `constructor_id` VARCHAR(191) NOT NULL,
    `printer_id` VARCHAR(191) NOT NULL,
    `submitter_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `JobMetadata_job_id_key`(`job_id`),
    UNIQUE INDEX `JobMetadata_submitter_id_key`(`submitter_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bid` (
    `id` VARCHAR(191) NOT NULL,
    `bidder` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BidMetadata` (
    `job_id` VARCHAR(191) NOT NULL,
    `bid_id` VARCHAR(191) NOT NULL,
    `bidder_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `BidMetadata_bid_id_key`(`bid_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Constructor` ADD CONSTRAINT `Constructor_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrinterMetadata` ADD CONSTRAINT `PrinterMetadata_printer_id_fkey` FOREIGN KEY (`printer_id`) REFERENCES `Printer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrinterMetadata` ADD CONSTRAINT `PrinterMetadata_constructor_id_fkey` FOREIGN KEY (`constructor_id`) REFERENCES `Constructor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobMetadata` ADD CONSTRAINT `JobMetadata_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobMetadata` ADD CONSTRAINT `JobMetadata_constructor_id_fkey` FOREIGN KEY (`constructor_id`) REFERENCES `Constructor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobMetadata` ADD CONSTRAINT `JobMetadata_printer_id_fkey` FOREIGN KEY (`printer_id`) REFERENCES `Printer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobMetadata` ADD CONSTRAINT `JobMetadata_submitter_id_fkey` FOREIGN KEY (`submitter_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BidMetadata` ADD CONSTRAINT `BidMetadata_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BidMetadata` ADD CONSTRAINT `BidMetadata_bid_id_fkey` FOREIGN KEY (`bid_id`) REFERENCES `Bid`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BidMetadata` ADD CONSTRAINT `BidMetadata_bidder_id_fkey` FOREIGN KEY (`bidder_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

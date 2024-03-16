/*
  Warnings:

  - You are about to drop the column `account_id` on the `student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_account_id_fkey`;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `account_id`;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `account_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

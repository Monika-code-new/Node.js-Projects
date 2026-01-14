-- AlterTable
ALTER TABLE `apitoken` ADD COLUMN `expiresAt` DATETIME(3) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

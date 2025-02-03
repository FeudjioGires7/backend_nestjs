-- CreateTable
CREATE TABLE `Etagere` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emplacementId` INTEGER NOT NULL,
    `capacite_max` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Etagere` ADD CONSTRAINT `Etagere_emplacementId_fkey` FOREIGN KEY (`emplacementId`) REFERENCES `Emplacement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

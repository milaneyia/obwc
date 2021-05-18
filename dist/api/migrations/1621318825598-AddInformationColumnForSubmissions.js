"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddInformationColumnForSubmissions1621318825598 = void 0;
class AddInformationColumnForSubmissions1621318825598 {
    constructor() {
        this.name = 'AddInformationColumnForSubmissions1621318825598';
    }
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE `submission` ADD `information` text NOT NULL');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE `submission` DROP COLUMN `information`');
    }
}
exports.AddInformationColumnForSubmissions1621318825598 = AddInformationColumnForSubmissions1621318825598;

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInformationColumnForSubmissions1621318825598 implements MigrationInterface {
    name = 'AddInformationColumnForSubmissions1621318825598';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `submission` ADD `information` text NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `submission` DROP COLUMN `information`');
    }

}

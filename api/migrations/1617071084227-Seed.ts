import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1617071084227 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO role (id, name) VALUES (1, 'User'), (2, 'Restricted'), (3, 'Staff');`);
        await queryRunner.query(`INSERT INTO judging_type (id, name) VALUES (1, 'Mappers'), (2, 'Players');`);
        await queryRunner.query(
            `INSERT INTO contest (id, name, announcementAt, registrationStartedAt, registrationEndedAt) VALUES (1, 'osu mode contest', NOW(), NOW(), NOW());`
        );
        await queryRunner.query(
            `INSERT INTO criteria (name, maxScore, judgingTypeId, contestId) VALUES ` +
            `('Expertise', 30, 1, 1),` +
            `('Cohesion', 30, 1, 1),` +
            `('Creativity', 30, 1, 1),` +
            `('Judge Impression', 10, 1, 1),` +
            `('Players Expertise', 30, 2, 1),` +
            `('Players Cohesion', 30, 2, 1),` +
            `('Players Creativity', 30, 2, 1),` +
            `('Players Judge Impression', 10, 2, 1);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.all([
            queryRunner.query(`DELETE FROM role;`),
            queryRunner.query(`DELETE FROM judging_type;`),
            queryRunner.query(`DELETE FROM contest;`),
            queryRunner.query(`DELETE FROM criteria;`),
        ]);
    }

}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1619685759578 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO role (id, name) VALUES (1, 'User'), (2, 'Restricted'), (3, 'Staff');`);
        await queryRunner.query(`INSERT INTO judging_type (id, name) VALUES (1, 'Mappers'), (2, 'Players');`);
        await queryRunner.query(
            `INSERT INTO contest (id, name, announcementAt, registrationStartedAt, registrationEndedAt) VALUES` +
            `(1, 'standard', '2021-05-02', '2021-05-02', '2021-05-16'),` +
            `(2, 'taiko', '2022-01-01', '2022-01-01', '2022-01-01'),` +
            `(3, 'catch', '2022-01-01', '2022-01-01', '2022-01-01'),` +
            `(4, 'mania', '2022-01-01', '2022-01-01', '2022-01-01');`
        );
        await queryRunner.query(
            `INSERT INTO round (id, contestId, submissionsStartedAt, submissionsEndedAt, judgingStartedAt, judgingEndedAt, resultsAt) VALUES` +
            `(1, 1, '2021-05-17', '2021-05-31', '2021-06-01', '2021-06-15', '2021-09-15'),` +
            `(2, 1, '2021-06-16', '2021-06-30', '2021-07-01', '2021-07-15', '2021-09-15'),` +
            `(3, 1, '2021-07-16', '2021-07-30', '2021-07-31', '2021-08-14', '2021-09-15'),` +
            `(4, 1, '2021-08-15', '2021-08-29', '2021-08-30', '2021-09-13', '2021-09-15');`
        );
        await queryRunner.query(
            `INSERT INTO criteria (name, maxScore, judgingTypeId, contestId) VALUES ` +
            `('Expertise', 30, 1, 1),` +
            `('Cohesion', 30, 1, 1),` +
            `('Creativity', 30, 1, 1),` +
            `('Judge Impression', 10, 1, 1),` +
            `('Sophistication', 30, 2, 1),` +
            `('Profundity', 30, 2, 1),` +
            `('Uniqueness', 30, 2, 1),` +
            `('Player Impression', 10, 2, 1);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.all([
            queryRunner.query(`DELETE FROM round;`),
            queryRunner.query(`DELETE FROM criteria;`),
        ]);
        await Promise.all([
            queryRunner.query(`DELETE FROM role;`),
            queryRunner.query(`DELETE FROM judging_type;`),
            queryRunner.query(`DELETE FROM contest;`),
        ]);
    }

}

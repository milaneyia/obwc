import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1617071084227 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO role (id, name) VALUES (1, 'User'), (2, 'Restricted'), (3, 'Staff');`);
        await queryRunner.query(`INSERT INTO criteria (name, maxScore, type) VALUES ('Expertise', 30, 1), ('Cohesion', 30, 1), ('Creativity', 30, 1), ('Judge Impression', 10, 1);`);
        await queryRunner.query(`INSERT INTO country VALUES (1,'Chile','CL'), (2,'France','FR'), (3,'United States','US'), (4,'China','CN'), (5,'Poland','PL'), (6,'Sweden','SE'), (7,'South Korea','KR'), (8,'Australia','AU');`);
        await queryRunner.query(
            `INSERT INTO user (id, osuId, username, roleId, countryId) VALUES ` +
                `(1,1052994,'Milan-', 1, 1),` +
                `(2,6100837,'Imakuri', 1, 1),` +
                `(3,3178418,'pishifat', 1, 1),` +
                `(4,6399568,'YokesPai', 1, 2),` +
                `(5,9648246,'delusional', 1, 2),` +
                `(6,5428909,'DTM9 Nowa', 1, 2),` +
                `(7,1997633,'Riana', 1, 3),` +
                `(8,2916414,'-PC', 1, 3),` +
                `(9,6491613,'-Tatsuo', 1, 3),` +
                `(10,9070739,'Phynta', 1, 4),` +
                `(11,3868653,'waefwerf', 1, 4),` +
                `(12,4150829,'Arbane', 1, 4),` +
                `(13,2850983,'Pachiru', 1, 5),` +
                `(14,9910665,'Matissse', 1, 5),` +
                `(15,2716981,'Nozhomi', 1, 5),` +
                `(16,3076909,'Mafumafu', 1, 6),` +
                `(17,5999631,'Venix', 1, 6),` +
                `(18,10234218,'Chai the Tea', 1, 6),` +
                `(19,1943309,'Acyl', 1, 7),` +
                `(20,4525153,'xLolicore-', 1, 7),` +
                `(21,8406396,'Yudragen', 1, 7),` +
                `(22,5918561,'J1_', 1, 8),` +
                `(23,918297,'Realazy', 1, 8),` +
                `(24,4600383,'Nakano Itsuki', 1, 8),` +
                `(25,689997,'captin1', 1, 1),` +
                `(26,5745865,'Altai', 1, 1),` +
                `(27,2204515,'Mao', 1, 1),` +
                `(28,2628870,'Chaos', 1, 2),` +
                `(29,10520912,'Teky', 1, 2),` +
                `(30,9155377,'hypercyte', 1, 3),` +
                `(31,4966334,'DeviousPanda', 1, 3),` +
                `(32,2688103,'IOException', 1, 4),` +
                `(33,12882468,'jasontime12345', 1, 4),` +
                `(34,9828042,'Yooh', 1, 5),` +
                `(35,9131844,'AYE1337', 1, 5),` +
                `(36,7458583,'Frakturehawkens', 1, 6),` +
                `(37,6642617,'Serizawa Haruki', 1, 6),` +
                `(38,3723742,'Pennek', 1, 7);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM user;`);
        await queryRunner.query(`DELETE FROM country;`);
        await queryRunner.query(`DELETE FROM role;`);
        await queryRunner.query(`DELETE FROM criteria;`);
    }

}

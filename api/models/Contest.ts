import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm';
import { Round } from './Round';

@Entity()
export class Contest extends BaseEntity {

    static open (): SelectQueryBuilder<Contest> {
        return Contest.createQueryBuilder('contest')
            .where('registrationStartedAt <= :now')
            .andWhere('registrationEndedAt > :now')
            .setParameter('now', new Date());
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column('datetime')
    announcementAt!: Date;

    @Column('datetime')
    registrationStartedAt!: Date;

    @Column('datetime')
    registrationEndedAt!: Date;

    @OneToMany(() => Round, (round) => round.contest)
    rounds!: Round[];

}

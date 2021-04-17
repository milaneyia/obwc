import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CreateContest } from '../../shared/interfaces';
import { Round } from './Round';

@Entity()
export class Contest extends BaseEntity {

    static fillAndSave (input: CreateContest, contest?: Contest): Promise<Contest> {
        if (!contest) {
            contest = new Contest();
        }

        contest.name = input.name;
        contest.isOpen = input.isOpen;

        return contest.save();
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ default: false })
    isOpen!: boolean;

    @OneToMany(() => Round, (round) => round.contest)
    rounds!: Round[];

}

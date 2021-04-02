import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Round } from '../Round';
import { User } from '../User';
import { JudgingType } from './JudgingType';

@Entity()
export class JudgeToRound extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    roundId!: number;

    @ManyToOne(() => Round, round => round.judgeToRounds)
    round!: Round;

    @Column()
    userId!: number;

    @ManyToOne(() => User, user => user.judgeToRounds)
    user!: User;

    @Column()
    judgingTypeId!: number;

    @ManyToOne(() => JudgingType)
    judgingType!: JudgingType;

}
